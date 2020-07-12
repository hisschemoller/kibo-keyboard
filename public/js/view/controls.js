import { dispatch, getActions, getState, STATE_CHANGE, } from '../store/store.js';
import { getWorld } from '../world/physics.js';

let rootEl, playEl, outputEl;
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
      }
    }
  });

  document.addEventListener('keyup', function(e) {

    // don't perform shortcuts while typing in a text input.
    if (!(e.target.tagName.toLowerCase() == 'input' && e.target.getAttribute('type') == 'text')) {
      switch (e.keyCode) {
        case 32: // space
          dispatch(getActions().togglePlay());
          break;
      }
    }

    resetKeyCombo.length = 0;
  });

  playEl.addEventListener('click', () => {
    dispatch(getActions().togglePlay());
  });

  rootEl.querySelector('#new').addEventListener('click', () => {
    dispatch(getActions().newProject());
  });
}

function handleStateChanges(e) {
  const { state, action, actions, } = e.detail;
  switch (action.type) {
    
    case actions.SET_PROJECT:
    case actions.TOGGLE_PLAY:
      togglePlay(state);
      break;
  }
}

export function setup() {
  rootEl = document.querySelector('#controls');
  playEl = rootEl.querySelector('#play');

  addEventListeners();
}

function togglePlay(state) {
  playEl.checked = state.isPlaying;
}
