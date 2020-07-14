
const initialState = {
  bodies: {
    allIds: [],
    byId: {},
  },
  joints: {
    allIds: [],
    byId: {},
  },
  note: {
    id: null,
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
      return {  ...initialState,
        bodies,
        joints: {
          allIds: [],
          byId: {},
        },
      };
    }

    case actions.PLAY_NOTE: {
      const { body, id } = action;
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

    default:
      return state ? state : initialState;
  }
}
