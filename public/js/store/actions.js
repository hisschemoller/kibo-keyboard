import { createUUID } from '../utils/utils.js';

const DELETE_BODIES = 'DELETE_BODIES';
const NEW_PROJECT = 'NEW_PROJECT';
const PLAY_NOTE = 'PLAY_NOTE';
const POPULATE = 'POPULATE';
const RESIZE = 'RESIZE';
const SET_PROJECT = 'SET_PROJECT';

// actions
export default {

  DELETE_BODIES,
  deleteBodies: bodyIds => ({ type: DELETE_BODIES, bodyIds }),
  
  NEW_PROJECT,
  newProject: () => ({ type: NEW_PROJECT, }),

  PLAY_NOTE,
  playNote: () => {
    return (dispatch, getState, getActions) => {
      const { visibleWidth, visibleHeight, } = getState();
      return {
        type: PLAY_NOTE,
        id: createUUID(),
        body: {
          fixtures: [
            { type: 'circle', r: 0.2, d: 0.1 },
          ],
          x: 0,
          y: visibleHeight * -0.5,
        },
      };
    };
  },

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
};
