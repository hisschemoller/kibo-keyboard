
const initialState = {
  bodies: {
    allIds: [],
    byId: {},
  },
  isPlaying: false,
  joints: {
    allIds: [],
    byId: {},
  },
};

/**
 * 
 * @param {Object} state 
 * @param {Object} action 
 * @param {String} action.type
 */
export default function reduce(state = initialState, action, actions = {}) {
  switch (action.type) {

    case actions.NEW_PROJECT: {
      const { bodies } = action;
      return { 
        ...initialState,
        bodies,
        joints: {
          allIds: [],
          byId: {},
        },
      };
    }

    case actions.SET_PROJECT:
      return { ...state, ...action.state };

    case actions.TOGGLE_PLAY:
      return {
        ...state,
        isPlaying: !state.isPlaying,
      };

    default:
      return state ? state : initialState;
  }
}
