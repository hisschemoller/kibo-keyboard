import { createUUID } from '../utils/utils.js';

const NEW_PROJECT = 'NEW_PROJECT';
const POPULATE = 'POPULATE';
const RESIZE = 'RESIZE';
const SET_PROJECT = 'SET_PROJECT';

// actions
export default {
  
  NEW_PROJECT,
  newProject: () => ({ type: NEW_PROJECT, }),

  POPULATE,
  populate: () => {
    return (dispatch, getState, getActions) => {
      const { visibleWidth, visibleHeight, } = getState();
      const floorId = createUUID();
      const leftId = createUUID();
      const rightId = createUUID();
      return { 
        type: POPULATE, 
        bodies: {
          allIds: [ floorId, 'ceiling', leftId, rightId ],
          byId: {
            [floorId]: {
              fixtures: [
                { w: visibleWidth, h: 0.5, d: 0.3, }
              ],
              x: 0,
              y: visibleHeight * -0.5,
              type: 'static',
            },
            ceiling: {
              fixtures: [ { w: 0.3, h: 0.3, d: 0.3 } ],
              x: 1.7,
              y: 3,
            },
            [leftId]: {
              fixtures: [ { w: 0.3, h: 0.3, d: 0.3 } ],
              x: visibleWidth * -0.5,
              y: visibleHeight * 0.5,
            },
            [rightId]: {
              fixtures: [ { w: 0.3, h: 0.3, d: 0.3 } ],
              x: visibleWidth * 0.5,
              y: visibleHeight * 0.5,
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
};
