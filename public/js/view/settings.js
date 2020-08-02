import { dispatch, getActions, getState, STATE_CHANGE, } from '../store/store.js';

let rootEl, layerEl, closeBtn, bluetoothConnectBtn, bluetoothStatusEl, midiInputsSelect, midiInputStatusEl;

function addEventListeners() {
	document.addEventListener(STATE_CHANGE, handleStateChanges);

	closeBtn.addEventListener('click', e => {
		dispatch(getActions().toggleSettings(false));
	});

	layerEl.addEventListener('click', e => {
		dispatch(getActions().toggleSettings(false));
	});

  midiInputsSelect.addEventListener('change', e => {
    dispatch(getActions().selectMIDIInput(e.target.value));
	});
	
	bluetoothConnectBtn.addEventListener('click', e => {
		dispatch(getActions().bluetoothConnect());
	});
}

function handleStateChanges(e) {
  const { state, action, actions, } = e.detail;
  switch (action.type) {

    case actions.BLUETOOTH_CONNECT:
      bluetoothStatusEl.textContent = 'Connecting...';
      bluetoothConnectBtn.setAttribute('disabled', 'disabled');
      break;

    case actions.BLUETOOTH_DISCONNECT:
      bluetoothStatusEl.textContent = 'Bluetooth disconnected.';
      bluetoothConnectBtn.removeAttribute('disabled');
      break;

    case actions.BLUETOOTH_ERROR:
      bluetoothStatusEl.textContent = 'Bluetooth error!';
      bluetoothConnectBtn.removeAttribute('disabled');
      break;
      
    case actions.BLUETOOTH_SUCCESS:
      bluetoothStatusEl.textContent = 'Bluetooth connected!';
      break;

    case actions.SELECT_MIDI_INPUT:
      updateMIDIInputs(state);
      break;

		case actions.SET_MIDI_ACCESSIBLE:
			showMIDIAccessible(state);
			break;

		case actions.TOGGLE_SETTINGS:
			showSettingsPanel(state);
			break;
    
		case actions.UPDATE_MIDI_PORTS:
			updateMIDIInputs(state);
			break;
  }
}

export function setup() {
	rootEl = document.querySelector('.settings');
	layerEl = rootEl.querySelector('.settings__layer');
	closeBtn = rootEl.querySelector('.settings__close');
	midiInputsSelect = rootEl.querySelector('.midiin-select');
	midiInputStatusEl = rootEl.querySelector('.midiin-status');
	bluetoothConnectBtn = rootEl.querySelector('.ble-connect');
	bluetoothStatusEl = rootEl.querySelector('.ble-status');
	
  addEventListeners();
}

function showMIDIAccessible(state) {
	const { isMIDIAccessible } = state;
	midiInputStatusEl.textContent = isMIDIAccessible ? '' : 'MIDI unavailable';
	if (isMIDIAccessible) {
		midiInputsSelect.removeAttribute('disabled');
	} else {
		midiInputsSelect.setAttribute('disabled', 'disabled');
	}
}

function showSettingsPanel(state) {
	const { isSettingsVisible } = state;
	if (isSettingsVisible) {
		rootEl.classList.add('settings--show');
	} else {
		rootEl.classList.remove('settings--show');
	}
}

function updateMIDIInputs(state) {
	const { midiInputs, midiSelectedInput } = state;

  midiInputsSelect.querySelectorAll('option').forEach((el, index) => {
    if (index > 0) {
      midiInputsSelect.removeChild(el);
    }
  });

  midiInputs.forEach(name => {
    const el = document.createElement('option');
    el.value = name;
    el.textContent = name;
    midiInputsSelect.appendChild(el);

    if (name === midiSelectedInput) {
      el.setAttribute('selected', 'selected');
    }
  });
}
