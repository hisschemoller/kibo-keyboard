import { dispatch, getActions, getState, persist } from './store/store.js';
import { setup as setupAudio } from './audio/audio.js';
import { accessMidi, setup as setupMidi, } from './midi/midi.js';
import { setup as setupBluetooth } from './bluetooth/bluetooth.js';
import { setup as setupWebGL } from './world/webgl.js';
import { setup as setupPhysics } from './world/physics.js';
import { setup as setupControls } from './view/controls.js';
import { setup as setupSettings } from './view/settings.js';

async function main() {
  let hasMIDIAccess = false;
  try {
    await accessMidi();
    hasMIDIAccess = true;
  } catch(error) {
    console.log('Error', error);
  } finally {
    setupAudio();
    setupWebGL();
    setupPhysics();
    setupSettings();
    setupControls();
    persist();
    setupMidi();
    setupBluetooth();
    dispatch(getActions().setMidiAccessable(hasMIDIAccess));
    dispatch(getActions().populate());
    dispatch(getActions().toggleSettings(true));
  }
}

main();
