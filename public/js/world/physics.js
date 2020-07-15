import { dispatch, getActions, STATE_CHANGE, } from '../store/store.js';
import { connectPhysicsAnd3D, renderScene, } from './webgl.js';
import { createPhysicsBody, createPhysicsJoint, destroyPhysicsBody, destroyPhysicsJoint,  } from './physics-factory.js';

const { Vec2, World } = planck;
const FPS = 60;
const SPF = 1 / FPS;

let world, floorBody, cleanupCounter = 0;

/**
 * Add event listeners.
 */
function addEventListeners() {
  document.addEventListener(STATE_CHANGE, onStateChange);
}

/**
 * Remove bodies that have fallen off screen.
 */
function cleanup() {
  const bodyIds = [];
  world.bodies.allIds.forEach(bodyId => {
    if (world.bodies.byId[bodyId].getPosition().y < floorBody.getPosition().y - 1) {
      bodyIds.push(bodyId);
    }
  });
  if (bodyIds.length) {
    dispatch(getActions().deleteBodies(bodyIds));
  }
}

/**
 * Store reference to mesh in each physics body for efficient draw loop.
 * @param {Object} scene 3D scene.
 */
export function connect3DAndPhysics(scene) {
  world.bodies.allIds.forEach(bodyId => {
    const body = world.bodies.byId[bodyId];
    if (scene.meshes.allIds.indexOf(bodyId) !== -1) {
      body.setUserData({ ...body.getUserData(), mesh: scene.getObjectByName(bodyId), });
    }
  });
}

/**
 * Create all bodies that don't exist yet.
 * @param {Object} state 
 */
function createBodies(state) {
  state.bodies.allIds.forEach(bodyId => {
    if (world.bodies.allIds.indexOf(bodyId) === -1) {
      createPhysicsBody(bodyId, state.bodies.byId[bodyId], { noteIndex: state.bodies.byId[bodyId].index });
    }
  });

  // store reference to mesh in each physics body for efficient draw loop
  connectPhysicsAnd3D(world);
}

/**
 * Create all joints that don't exist yet.
 * @param {Object} state 
 */
function createJoints(state) {
  state.joints.allIds.forEach(jointId => {
    if (!world.joints.allIds.includes(jointId)) {
      createPhysicsJoint(jointId, state.joints.byId[jointId]);
    }
  });
}

/**
 * Destroy all bodies that are not in the state anymore.
 * @param {Object} state 
 */
function destroyBodies(state) {
  let i = world.bodies.allIds.length;
  while (--i >= 0) {
    const bodyId = world.bodies.allIds[i];
    if (state.bodies.allIds.indexOf(bodyId) === -1) {
      destroyPhysicsBody(bodyId);
    }
  }
}

/**
 * Destroy all joints that are not in the state anymore.
 * @param {Object} state 
 */
function destroyJoints(state) {
  let i = world.joints.allIds.length;
  while (--i >= 0) {
    const jointId = world.joints.allIds[i];
    if (state.joints.allIds.indexOf(jointId) === -1) {
      destroyPhysicsJoint(jointId);
    }
  }
}

/**
 * Update the physics world and render the results in 3D.
 */
function draw() {
  world.step(SPF);

  // update 3D objects position and rotation
  let body = world.getBodyList();
  while (body && body.getUserData()) {
    const { mesh } = body.getUserData();
    if (mesh) {
      const position = body.getPosition();
      mesh.position.x = position.x;
      mesh.position.y = position.y;
      
      // getAngle() function returns the rotation in radians
      mesh.rotation.z = body.getAngle();
    }

    // get the next body
    body = body.getNext();
  }

  renderScene();

  cleanupCounter++;
  if (cleanupCounter > 100) {
    cleanupCounter = 0;
    cleanup();
  }

  requestAnimationFrame(draw);
}

/**
 * 
 */
export function getWorld() {
  return world;
}

/**
 * Launch a new note circle from under the floor.
 */
function launchNoteBody(state) {
  const { note } = state;
  const { id, index } = note; 
  const x = (Math.random() * 0.1) - 0.05;
  const y = 10 + Math.random() * 10;
  const body = world.bodies.byId[id];
  body.setUserData({ ...body.getUserData(), noteIndex: index });
  body.setLinearVelocity(Vec2(x, y));
}

/**
 * Handle collision on a note circle.
 * @param {Number} index Note index.
 * @param {Object} contact 
 * @param {Object} impulse 
 * @param {Function} sumArrayValues 
 */
function noteCollision(index, contact, impulse, sumArrayValues) {
  if (!contact.force) {
    contact.force = impulse.normalImpulses.reduce(sumArrayValues) + impulse.tangentImpulses.reduce(sumArrayValues);
  }
  dispatch(getActions().playNoteCollision(index, contact.force));
}

/**
 * Handle changes in the app state.
 * @param {Object} e CustomEvent from Store when state has been updated.
 */
function onStateChange(e) {
  const { state, action, actions, } = e.detail;
  switch (action.type) {

    case actions.DELETE_BODIES:
      destroyBodies(state);
      break;

    case actions.PLAY_NOTE:
      createBodies(state);
      launchNoteBody(state);
      break;

    case actions.POPULATE:
      destroyJoints(state);
      destroyBodies(state);
      createBodies(state);
      createJoints(state);
      storeFloorBody();
      break;
  }
}

/**
 * Create the physics world.
 * @param {Object} specs 
 */
export function setup() {
  setupPhysicsWorld();
  addEventListeners();
  draw();
}

/**
 * Set up the Box2D planck.js physics world.
 */
function setupPhysicsWorld() {
  const sumArrayValues = (accumulator, currentValue) => accumulator + currentValue;
  const gravity = new Vec2(0, -9.8);
  world = new World(gravity);

  world.bodies = {
    allIds: [],
    byId: {},
  }
  world.joints = {
    allIds: [],
    byId: {},
  }

  world.on('begin-contact', contact => {
    contact.force = 0;
  });
  world.on('pre-solve', function(contact, oldManifold) {
    const bodyA = contact.getFixtureA().getBody();
    const bodyB = contact.getFixtureB().getBody();
    if (
      (bodyA === floorBody && bodyA.getPosition().y > bodyB.getPosition().y) ||
      (bodyB === floorBody && bodyB.getPosition().y > bodyA.getPosition().y)
    ) {
      contact.setEnabled(false);
    }
  });
  world.on('post-solve', (contact, impulse) => {
    if (!contact.force) {
      const { noteIndex: noteIndexA = -1 } = contact.getFixtureA().getBody().getUserData();
      const { noteIndex: noteIndexB = -1 } = contact.getFixtureB().getBody().getUserData();
      if (noteIndexA > -1) {
        noteCollision(noteIndexA, contact, impulse, sumArrayValues);
      }
      if (noteIndexB > -1) {
        noteCollision(noteIndexB, contact, impulse, sumArrayValues);
      }
    }
  });
}

function storeFloorBody() {
  const floorBodyId = world.bodies.allIds.find(bodyId => bodyId.indexOf('FLOOR') > -1);
  floorBody = world.bodies.byId[floorBodyId];
}
