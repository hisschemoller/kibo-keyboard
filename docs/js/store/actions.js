import { createUUID, lowestOctave, numOctaves, pitches } from '../utils/utils.js';
import { NOTE_ON } from '../midi/midi.js';

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
const SELECT_MIDI_INPUT = 'SELECT_MIDI_INPUT';
const SET_MIDI_ACCESSIBLE = 'SET_MIDI_ACCESSIBLE';
const SET_PROJECT = 'SET_PROJECT';
const TOGGLE_SETTINGS = 'TOGGLE_SETTINGS';
const UPDATE_MIDI_PORTS = 'UPDATE_MIDI_PORTS';

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
  playNote: (command, channel, pitch, velocity) => {
    return (dispatch, getState, getActions) => {
      const { visibleWidth, visibleHeight, } = getState();
      const index = pitches.indexOf(pitch);

      if (index === -1 || velocity === 0 || command !== NOTE_ON) {
        return;
      }

      const octave = lowestOctave + Math.floor((velocity / 127) * numOctaves);
      const radius = (visibleHeight * 0.06) - (((octave - lowestOctave) / numOctaves) * (visibleHeight * 0.05));
      const circleArea = Math.PI * (radius ** 2);

      return {
        type: PLAY_NOTE,
        bodyId: createUUID(),
        circleArea,
        index,
        octave,
        originalVelocity: velocity,
        velocity: 120,
        body: {
          fixtures: [
            { type: 'circle', r: radius, d: 0.01 },
          ],
          x: visibleWidth * ((index / 8 ) - ( 7 / 16)),
          y: visibleHeight * -0.5,
        },
      };
    };
  },

  PLAY_NOTE_COLLISION,
  playNoteCollision: (index, octave, circleArea, force) => ({
    type: PLAY_NOTE_COLLISION,
    circleArea,
    index,
    octave,
    velocity: Math.floor(Math.max(1, Math.min(force * 127, 127))),
  }),

  POPULATE,
  populate: () => {
    return (dispatch, getState, getActions) => {
      const { visibleWidth, visibleHeight, } = getState();
      const floorId = `FLOOR_${createUUID()}`;
      const ceilingId = `CEILING_${createUUID()}`;
      return { 
        type: POPULATE, 
        bodies: {
          allIds: [ floorId, ceilingId ],
          byId: {
            [floorId]: {
              fixtures: [ { w: visibleWidth, h: 0.01, d: 0.01, } ],
              x: 0,
              y: visibleHeight * -0.4,
              type: 'static',
            },
            [ceilingId]: {
              fixtures: [ { w: visibleWidth, h: 0.01, d: 0.01, } ],
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

  SELECT_MIDI_INPUT,
  selectMIDIInput: name => ({ type: SELECT_MIDI_INPUT, name, }),

  SET_MIDI_ACCESSIBLE,
  setMidiAccessible: value => ({ type: SET_MIDI_ACCESSIBLE, value }),
  
  SET_PROJECT,
  setProject: state => ({ type: SET_PROJECT, state }),

  TOGGLE_SETTINGS,
  toggleSettings: value => ({ type: TOGGLE_SETTINGS, value }),

  UPDATE_MIDI_PORTS,
  updateMIDIPorts: (portNames, portType) => ({ type: UPDATE_MIDI_PORTS, portNames, portType, }),
};
