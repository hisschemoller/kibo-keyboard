import { dispatch, getActions, getState, STATE_CHANGE, } from '../store/store.js';

let rootEl, layerEl, closeBtn;

function addEventListeners() {
	document.addEventListener(STATE_CHANGE, handleStateChanges);

	closeBtn.addEventListener('click', e => {
		dispatch(getActions().toggleSettings(false));
	});

	layerEl.addEventListener('click', e => {
		dispatch(getActions().toggleSettings(false));
	});
}

function handleStateChanges(e) {
  const { state, action, actions, } = e.detail;
  switch (action.type) {

		case actions.TOGGLE_SETTINGS:
			showSettingsPanel(state);
			break;
  }
}

export function setup() {
	rootEl = document.querySelector('.settings');
	layerEl = rootEl.querySelector('.settings__layer');
	closeBtn = rootEl.querySelector('.settings__close');
  addEventListeners();
}

function showSettingsPanel(state) {
	const { isSettingsVisible } = state;
	if (isSettingsVisible) {
		rootEl.classList.add('settings--show');
	} else {
		rootEl.classList.remove('settings--show');
	}
}
