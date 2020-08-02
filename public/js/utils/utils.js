/**
 * Create a fairly unique ID.
 * @see https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 */
export function createUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

export let lowestOctave = 4;
export let numOctaves = 4;
export let pitches = [60, 62, 64, 65, 67, 69, 71, 72];
