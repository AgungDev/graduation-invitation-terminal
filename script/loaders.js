import { state } from './state.js';
import { loadJsonFile } from './utils.js';

export async function loadAppConfig() {
  const appConfig = await loadJsonFile('./config/config.json', 'App config');
  if (appConfig) {
    Object.assign(state.config, appConfig);
  }
}

export async function loadGuestList() {
  const guestList = await loadJsonFile('./config/guests.json', 'Guest list');
  if (guestList) {
    state.guests = guestList;
  }
}

export async function loadCommandResponses() {
  const responses = await loadJsonFile('./config/commandResponses.json', 'Command responses');
  if (responses) {
    state.commandResponses = responses;
  }
}

export async function loadBootLinesConfig() {
  const bootLines = await loadJsonFile('./config/bootlines.json', 'Boot lines config');
  if (bootLines) {
    state.bootLinesConfig = bootLines;
  }
}
