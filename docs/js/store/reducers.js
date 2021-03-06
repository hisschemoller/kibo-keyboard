
const initialState = {
  bodies: {
    allIds: [],
    byId: {},
  },
  isMIDIAccessible: false,
  isSettingsVisible: false,
  joints: {
    allIds: [],
    byId: {},
  },
  midiInputs: [],
  midiOutputs: [],
  midiSelectedInput: null,
  note: {
    circleArea: 0,
    id: null,
    index: 0,
    octave: 0,
    velocity: 0,
  },
  visibleHeight: 0,
  visibleWidth: 0,
};

/**
 * 
 * @param {Object} state 
 * @param {Object} action 
 * @param {String} action.type
 */
export default function reduce(state = initialState, action, actions = {}) {
  switch (action.type) {

    case actions.DELETE_BODIES: {
      const { bodyIds } = action;
      return { 
        ...state, 
        bodies: {
          allIds: [ 
            ...state.bodies.allIds.reduce((accumulator, bodyId) => {
              if (bodyIds.includes(bodyId)) {
                return accumulator;
              }
              return [ ...accumulator, bodyId ];
            }, []),
          ],
          byId: { 
            ...state.bodies.allIds.reduce((accumulator, bodyId) => {
              if (bodyIds.includes(bodyId)) {
                return accumulator;
              }
              return { ...accumulator, [bodyId]: { ...state.bodies.byId[bodyId] } };
            }, {}),
          }
        },
      };
    }

    case actions.NEW_PROJECT: {
      const { bodies } = action;
      const { isMIDIAccessible, midiInputs = [], midiOutputs = [], visibleHeight, visibleWidth } = state;
      return { 
        ...initialState,
        bodies,
        isMIDIAccessible,
        joints: {
          allIds: [],
          byId: {},
        },
        midiInputs, 
        midiOutputs, 
        visibleHeight,
        visibleWidth,
      };
    }

    case actions.PLAY_NOTE: {
      const { body, bodyId, circleArea, index, octave, originalVelocity, velocity } = action;
      return { 
        ...state,
        bodies: {
          allIds: [ ...state.bodies.allIds, bodyId ],
          byId: { 
            ...state.bodies.allIds.reduce((accumulator, bodyId) => {
              accumulator[bodyId] = { ...state.bodies.byId[bodyId] };
              return accumulator;
            }, {}),
            [bodyId]: body,
          }
        }, 
        note: {
          bodyId,
          circleArea,
          index,
          octave,
          originalVelocity,
          velocity,
        },
      };
    }

    case actions.PLAY_NOTE_COLLISION: {
      const { circleArea, index, octave, velocity } = action;
      return { 
        ...state,
        note: {
          id: 'collision',
          index,
          octave,
          velocity,
        },
      }
    }

    case actions.POPULATE: {
      const { bodies } = action;
      return { ...state, bodies, };
    }

    case actions.RESIZE: {
      const { visibleWidth, visibleHeight } = action;
      return { ...state, visibleWidth, visibleHeight };
    }

    case actions.SELECT_MIDI_INPUT: {
      return { ...state, midiSelectedInput: action.name, };
    }

    case actions.SET_MIDI_ACCESSIBLE: {
      const { value } = action;
      return { ...state, isMIDIAccessible: value };
    }

    case actions.SET_PROJECT: {
      const { isMIDIAccessible, midiInputs = [], midiOutputs = [], visibleWidth, visibleHeight } = state;
      return { 
        ...initialState,
        bodies: {
          allIds: [],
          byId: {},
        },
        joints: {
          allIds: [],
          byId: {},
        },
        ...state, 
        ...action.state,
        isMIDIAccessible, 
        midiInputs, 
        midiOutputs, 
        visibleHeight, 
        visibleWidth,
      };
    }

    case actions.TOGGLE_SETTINGS: {
      const { value } = action;
      return { ...state, isSettingsVisible: value };
    }

    case actions.UPDATE_MIDI_PORTS: {
      const { portNames, portType, } = action;
      const { midiInputs = [], midiOutputs = [], } = state;
      return {
        ...state,
        midiInputs: portType === 'input' ? [ ...portNames ] : midiInputs,
        midiOutputs: portType === 'output' ? [ ...portNames ] : midiOutputs,
      };
    }

    default:
      return state ? state : initialState;
  }
}
