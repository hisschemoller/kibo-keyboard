import { dispatch, getActions, getState, persist } from './store/store.js';
import { setup as setupWebGL } from './world/webgl.js';
import { setup as setupPhysics } from './world/physics.js';

async function main() {
  setupWebGL();
  setupPhysics();
  persist();
}

main();