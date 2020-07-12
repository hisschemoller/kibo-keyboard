import { dispatch, getActions, getState, persist } from './store/store.js';

async function main() {
  persist();
}

main();