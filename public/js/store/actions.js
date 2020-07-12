
const NEW_PROJECT = 'NEW_PROJECT';
const SET_PROJECT = 'SET_PROJECT';
const TOGGLE_PLAY = 'TOGGLE_PLAY';

// actions
export default {
  
  NEW_PROJECT,
  newProject: () => ({ 
    type: NEW_PROJECT, 
    bodies: {
      allIds: [ 'floor', 'ceiling' ],
      byId: {
        floor: {
          fixtures: [
            {}
          ],
          x: -1,
          y: 2,
        },
        ceiling: {
          fixtures: [ {} ],
          x: 0,
          y: -2,
        },
      },
    }
  }),
  
  SET_PROJECT,
  setProject: state => ({ type: SET_PROJECT, state }),

  TOGGLE_PLAY,
  togglePlay: () => ({ type: TOGGLE_PLAY, }),
};
