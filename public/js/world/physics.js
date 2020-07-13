import { dispatch, getActions, STATE_CHANGE, } from '../store/store.js';
import { connectPhysicsAnd3D, renderScene, } from './webgl.js';
import { createPhysicsBody, createPhysicsJoint, destroyPhysicsBody, destroyPhysicsJoint,  } from './physics-factory.js';

const { Vec2, World } = planck;
const FPS = 60;
const SPF = 1 / FPS;

let world,
  isPlaying = true;

/**
 * Add event listeners.
 */
function addEventListeners() {
  document.addEventListener(STATE_CHANGE, onStateChange);
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
      createPhysicsBody(bodyId, state.bodies.byId[bodyId]);
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
  if (isPlaying) {
    world.step(SPF);
  }

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

  requestAnimationFrame(draw);
}

/**
 * 
 */
export function getWorld() {
  return world;
}

/**
 * Handle changes in the app state.
 * @param {Object} e CustomEvent from Store when state has been updated.
 */
function onStateChange(e) {
  const { state, action, actions, } = e.detail;
  switch (action.type) {

    case actions.POPULATE:
      destroyJoints(state);
      destroyBodies(state);
      createBodies(state);
      createJoints(state);
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
}
