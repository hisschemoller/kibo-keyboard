
const initialState = {
};

/**
 * 
 * @param {Object} state 
 * @param {Object} action 
 * @param {String} action.type
 */
export default function reduce(state = initialState, action, actions = {}) {
  switch (action.type) {

    case actions.NEW_PROJECT:
      return { 
        ...initialState,
      };

    case actions.SET_PROJECT:
      return { ...state, ...action.state };

    default:
      return state ? state : initialState;
  }
}
