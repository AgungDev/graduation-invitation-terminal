import { loadAppConfig, loadGuestList, loadCommandResponses, loadBootLinesConfig } from './loaders.js';
import { setupGuest, updateInvitationDetails, runBootSequence } from './ui.js';
import { renderCommandPanel, executeCommand } from './commands.js';
import { terminalInput } from './dom.js';

function bindTerminalInput() {
  if (!terminalInput) return;

  terminalInput.addEventListener('keydown', event => {
    if (event.key !== 'Enter') return;
    const value = event.target.value.trim();
    if (!value) return;
    executeCommand(value);
    event.target.value = '';
  });
}

export async function init() {
  await loadAppConfig();
  await loadGuestList();
  await loadCommandResponses();
  await loadBootLinesConfig();
  setupGuest();
  updateInvitationDetails();
  renderCommandPanel();
  bindTerminalInput();
  runBootSequence();
}
