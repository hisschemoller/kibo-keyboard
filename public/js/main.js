import { dispatch, getActions, getState, persist } from './store/store.js';
import { setup as setupAudio } from './audio/audio.js';
import { setup as setupWebGL } from './world/webgl.js';
import { setup as setupPhysics } from './world/physics.js';
import { setup as setupControls } from './view/controls.js';
import { setup as setupSettings } from './view/settings.js';

async function main() {
  setupAudio();
  setupWebGL();
  setupPhysics();
  setupSettings();
  setupControls();
  persist();

  // showDialog(
  //   'Kibo Piano', 
  //   `Click OK to start audio.`,
  //   'OK',
  //   () => { dispatch(getActions().populate()) },
  // );

  dispatch(getActions().toggleSettings(true))
}

main();