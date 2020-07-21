import { dispatch, getActions, getState, STATE_CHANGE, } from '../store/store.js';
import { pitches } from '../utils/utils.js';

const NOTE_ON = 144;
const NOTE_OFF = 128;
const numVoices = 84;
const pitchRange = new Array(127).fill(null);
const voices = [];
let audioCtx;
let voiceIndex = 0;

/**
 * Create the bank of reusable voice objects.
 */
function createVoices() {
	for (let i = 0; i < numVoices; i++) {
		const gain = audioCtx.createGain();
		gain.connect(audioCtx.destination);

		voices.push({
			isPlaying: false,
			gain,
			osc: null,
			source: null,
			timerId: null,
		});
	}
}

/**
 * Handle MIDI message.
 * @param {Object} state 
 */
function handleMIDI(state) {
	const {data0, data1, data2 } = state;
	switch (data0) {
		case NOTE_ON:
			startNote(0, data1, data2);
			break;
		
		case NOTE_OFF:
			stopNote(0, data1, data2);
			break;
		
		default:
			console.log('unhandled MIDI data: ', data0, data1, data2);
	}
}

/**
 * App state changed.
 * @param {Event} e Custom event.
 */
function handleStateChanges(e) {
	const { state, action, actions, } = e.detail;
	switch (action.type) {

		case actions.TOGGLE_SETTINGS:
			initialiseAudio(state);
			break;

		case actions.PLAY_NOTE:
		case actions.PLAY_NOTE_COLLISION:
			playNote(state);
			break;
	}
}

/**
 * Audio initialised after user generated event.
 * In this case a click on the Bluetooth connect button.
 */
function initialiseAudio(state) {
	const { isSettingsVisible } = state;
	if (!audioCtx && !isSettingsVisible) {
		audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		createVoices();
	}
}

/**
 * Converts a MIDI pitch number to frequency.
 * @param  {Number} midi MIDI pitch (0 ~ 127)
 * @return {Number} Frequency (Hz)
 */
function mtof(midi) {
	if (midi <= -1500) return 0;
	else if (midi > 1499) return 3.282417553401589e+38;
	else return 440.0 * Math.pow(2, (Math.floor(midi) - 69) / 12.0);
};

/**
 * Play a note.
 * @param {Object} state Application state.
 */
function playNote(state) {
	const { bodyId, index, octave, velocity } = state.note;
	const pitch = pitches[index] + (octave * 12);
	if (audioCtx) {
		// startNote(0, pitch, velocity);
		// stopNote(0.5, pitch, velocity);
		playOneShot(0, pitch, velocity, 0.5);
	}
}

/**
 * 
 * @param {*} nowToStartInSecs 
 * @param {*} pitch 
 * @param {*} velocity 
 */
function playOneShot(nowToStartInSecs, pitch, velocity, duration) {
	const voice = voices[voiceIndex];
	voiceIndex = ++voiceIndex % numVoices;

	if (voice.isPlaying) {
		stopOneShot(voice);
	}
	
	const startTime = audioCtx.currentTime + nowToStartInSecs;
	voice.isPlaying = true;
	voice.osc = audioCtx.createOscillator();
	voice.osc.type = 'sine';
	voice.osc.frequency.setValueAtTime(mtof(pitch), startTime);
	voice.osc.connect(voice.gain);
	voice.osc.start(startTime);
	voice.gain.gain.setValueAtTime(velocity**2 / 127**2, startTime);
	voice.gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.5);

	voice.timerId = setTimeout(stopOneShot, duration * 1000, voice);
}

function stopOneShot(voice) {
	if (voice.timerId) {
		clearTimeout(voice.timerId);
	}

	voice.osc.stop(audioCtx.currentTime);
	voice.isPlaying = false;
	voice.timerId = null;
}

/**
 * Setup at app start.
 */
export function setup() {
	document.addEventListener(STATE_CHANGE, handleStateChanges);
}

/**
 * 
 * @param {*} nowToStartInSecs 
 * @param {*} pitch 
 * @param {*} velocity 
 */
function startNote(nowToStartInSecs, pitch, velocity) {
	stopNote(0, pitch, velocity);

	const startTime = audioCtx.currentTime + nowToStartInSecs;
	const voice = voices[voiceIndex];
	voiceIndex = ++voiceIndex % numVoices;
	
	voice.isPlaying = true;
	voice.osc = audioCtx.createOscillator();
	voice.osc.type = 'sine';
	voice.osc.frequency.setValueAtTime(mtof(pitch), startTime);
	voice.osc.connect(voice.gain);
	voice.osc.start(startTime);
	voice.gain.gain.setValueAtTime(velocity**2 / 127**2, startTime);
	voice.gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.5);

	pitchRange[pitch] = voice;
}

/**
 * 
 * @param {*} nowToStopInSecs 
 * @param {*} pitch 
 * @param {*} velocity 
 */
function stopNote(nowToStopInSecs, pitch, velocity) {
	if (pitchRange[pitch]) {
		pitchRange[pitch].osc.stop(audioCtx.currentTime + nowToStopInSecs);
		pitchRange[pitch].isPlaying = false;
		pitchRange[pitch] = null;
	}
}
