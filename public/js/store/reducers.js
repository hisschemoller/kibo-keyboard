
const initialState = {
  bodies: {
    allIds: [],
    byId: {},
  },
  isMIDIAccessable: false,
  isSettingsVisible: false,
  joints: {
    allIds: [],
    byId: {},
  },
  midiInputs: [],
  midiOutputs: [],
  midiSelectedInput: null,
  note: {
    id: null,
    index: -1,
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
      return { 
        ...initialState,
        bodies,
        isMIDIAccessable: state.isMIDIAccessable,
        joints: {
          allIds: [],
          byId: {},
        },
      };
    }

    case actions.PLAY_NOTE: {
      const { body, id, index, velocity } = action;
      return { 
        ...state,
        bodies: {
          allIds: [ ...state.bodies.allIds, id ],
          byId: { 
            ...state.bodies.allIds.reduce((accumulator, bodyId) => {
              accumulator[bodyId] = { ...state.bodies.byId[bodyId] };
              return accumulator;
            }, {}),
            [id]: body,
          }
        }, 
        note: {
          id,
          index,
          velocity,
        },
      };
    }

    case actions.PLAY_NOTE_COLLISION: {
      const { id, index, velocity } = action;
      return { 
        ...state,
        note: {
          id: 'collision',
          index,
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

    case actions.SET_MIDI_ACCESSABLE: {
      const { value } = action;
      return { ...state, isMIDIAccessable: value };
    }

    case actions.SET_PROJECT: {
      const { isMIDIAccessable, midiInputs = [], midiOutputs = [], visibleWidth, visibleHeight } = state;
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
        isMIDIAccessable, 
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
