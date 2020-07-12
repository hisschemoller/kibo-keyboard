
const NEW_PROJECT = 'NEW_PROJECT';
const SET_PROJECT = 'SET_PROJECT';

// actions
export default {

  NEW_PROJECT,
  newProject: () => ({ type: NEW_PROJECT }),
  
  SET_PROJECT,
  setProject: state => ({ type: SET_PROJECT, state }),
};
