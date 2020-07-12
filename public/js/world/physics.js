import { dispatch, getActions, STATE_CHANGE, } from '../store/store.js';
import { connectPhysicsAnd3D, renderScene, } from './webgl.js';

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
 * Update the physics world and render the results in 3D.
 */
function draw() {
  if (isPlaying) {
    world.step(SPF);
  }

  renderScene();

  requestAnimationFrame(draw);
}

/**
 * Handle changes in the app state.
 * @param {Object} e CustomEvent from Store when state has been updated.
 */
function onStateChange(e) {
  const { state, action, actions, } = e.detail;
  switch (action.type) {
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
}
