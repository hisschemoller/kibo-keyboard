import { dispatch, getActions, getState, persist } from './store/store.js';
import { setup as setupWebGL } from './world/webgl.js';
import { setup as setupPhysics } from './world/physics.js';
import { setup as setupControls } from './view/controls.js';

async function main() {
  setupWebGL();
  setupPhysics();
  setupControls();
  persist();
}

main();