import { dispatch, getActions, getState, STATE_CHANGE, } from '../store/store.js';
import { getWorld } from '../world/physics.js';
import { pitches } from '../utils/utils.js';
import { NOTE_ON } from '../midi/midi.js';

let rootEl, settingsBtn;
let resetKeyCombo = [];

function addEventListeners() {
  document.addEventListener(STATE_CHANGE, handleStateChanges);

  document.addEventListener('keydown', e => {

    // don't perform shortcuts while typing in a text input.
    if (!(e.target.tagName.toLowerCase() == 'input' && e.target.getAttribute('type') == 'text')) {
      switch (e.keyCode) {
        case 82: // r
        case 83: // s
        case 84: // t
          // clear all data on key combination 'rst' (reset)
          resetKeyCombo.push(e.keyCode);
          if (resetKeyCombo.indexOf(82) > -1 && resetKeyCombo.indexOf(83) > -1 && resetKeyCombo.indexOf(84) > -1) {
            localStorage.clear();
            dispatch(getActions().newProject());
          }
          break;
        
        case 87: // w
          console.log('world', getWorld());
          console.log('state', getState());
          break;
        
        case 49: // 1
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56: // 8
          dispatch(getActions().playNote(NOTE_ON, 1, pitches[e.keyCode - 49], 120));
          break;
      }
    }
  });

  document.addEventListener('keyup', () => {
    resetKeyCombo.length = 0;
  });

  settingsBtn.addEventListener('click',e => {
    dispatch(getActions().toggleSettings(true));
  });
}

function handleStateChanges(e) {
  const { state, action, actions, } = e.detail;
  switch (action.type) {
  }
}

export function setup() {
  rootEl = document.querySelector('#controls');
  settingsBtn = rootEl.querySelector('#controls__settings');
  addEventListeners();
}
