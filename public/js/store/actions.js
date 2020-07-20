import { createUUID, pitches } from '../utils/utils.js';

const BLUETOOTH_CONNECT = 'BLUETOOTH_CONNECT';
const BLUETOOTH_DISCONNECT = 'BLUETOOTH_DISCONNECT';
const BLUETOOTH_ERROR = 'BLUETOOTH_ERROR';
const BLUETOOTH_SUCCESS = 'BLUETOOTH_SUCCESS';
const DELETE_BODIES = 'DELETE_BODIES';
const NEW_PROJECT = 'NEW_PROJECT';
const PLAY_NOTE = 'PLAY_NOTE';
const PLAY_NOTE_COLLISION = 'PLAY_NOTE_COLLISION';
const POPULATE = 'POPULATE';
const RESIZE = 'RESIZE';
const SET_PROJECT = 'SET_PROJECT';
const TOGGLE_SETTINGS = 'TOGGLE_SETTINGS';

// actions
export default {

  BLUETOOTH_CONNECT,
  bluetoothConnect: () => ({ type: BLUETOOTH_CONNECT }),

  BLUETOOTH_DISCONNECT,
  bluetoothDisconnect: () => ({ type: BLUETOOTH_DISCONNECT }),

  BLUETOOTH_ERROR,
  bluetoothError: () => ({ type: BLUETOOTH_ERROR }),

  BLUETOOTH_SUCCESS,
  bluetoothSuccess: () => ({ type: BLUETOOTH_SUCCESS }),

  DELETE_BODIES,
  deleteBodies: bodyIds => ({ type: DELETE_BODIES, bodyIds }),
  
  NEW_PROJECT,
  newProject: () => ({ type: NEW_PROJECT, }),

  PLAY_NOTE,
  playNote: index => {
    return (dispatch, getState, getActions) => {
      const { visibleWidth, visibleHeight, } = getState();
      return {
        type: PLAY_NOTE,
        id: createUUID(),
        index,
        velocity: 120,
        body: {
          fixtures: [
            { type: 'circle', r: 0.2, d: 0.1 },
          ],
          x: visibleWidth * ((index / 8 ) - ( 7 / 16)),
          y: visibleHeight * -0.5,
        },
      };
    };
  },

  PLAY_NOTE_COLLISION,
  playNoteCollision: (index, force) => ({
    type: PLAY_NOTE_COLLISION,
    index,
    velocity: Math.floor(Math.max(1, Math.min(force * 127, 127))),
  }),

  POPULATE,
  populate: () => {
    return (dispatch, getState, getActions) => {
      const { visibleWidth, visibleHeight, } = getState();
      const floorId = `FLOOR_${createUUID()}`;
      const leftId = createUUID();
      const rightId = createUUID();
      return { 
        type: POPULATE, 
        bodies: {
          allIds: [ floorId, 'ceiling' ],
          byId: {
            [floorId]: {
              fixtures: [ { w: visibleWidth, h: 0.1, d: 0.1, } ],
              x: 0,
              y: visibleHeight * -0.4,
              type: 'static',
            },
            ceiling: {
              fixtures: [ { w: visibleWidth, h: 0.1, d: 0.1, } ],
              x: 0,
              y: visibleHeight * 0.5,
              type: 'static',
            },
          },
        },
      };
    };
  },

  RESIZE,
  resize: (visibleWidth, visibleHeight) => ({ type: RESIZE, visibleWidth, visibleHeight }),
  
  SET_PROJECT,
  setProject: state => ({ type: SET_PROJECT, state }),

  TOGGLE_SETTINGS,
  toggleSettings: value => ({ type: TOGGLE_SETTINGS, value }),
};
