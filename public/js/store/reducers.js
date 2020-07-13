
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

    case actions.NEW_PROJECT: {
      const { bodies } = action;
      return {  ...initialState,
        bodies,
        joints: {
          allIds: [],
          byId: {},
        },
      };
    }

    case actions.POPULATE: {
      const { bodies } = action;
      return { ...state, bodies, };
    }

    case actions.RESIZE: {
      const { visibleWidth, visibleHeight } = action;
      return { ...state, visibleWidth, visibleHeight };
    }

    case actions.SET_PROJECT: {
      const { visibleWidth, visibleHeight } = state;
      return { ...state, ...action.state, visibleHeight, visibleWidth, };
    }

    case actions.TOGGLE_PLAY:
      return {
        ...state,
        isPlaying: !state.isPlaying,
      };

    default:
      return state ? state : initialState;
  }
}
