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
  
  // Show a full-screen prompt so user explicitly taps/clicks to start (helps autoplay)
  await new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.id = 'startOverlay';
    overlay.style.position = 'fixed';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0,0,0,0.6)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999';
    overlay.style.cursor = 'pointer';

    const box = document.createElement('div');
    box.style.color = '#fff';
    box.style.fontSize = '20px';
    box.style.padding = '24px 32px';
    box.style.borderRadius = '8px';
    box.style.background = 'rgba(0,0,0,0.5)';
    box.style.textAlign = 'center';
    box.textContent = 'Tap anywhere to start';

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const start = () => {
      document.removeEventListener('click', start);
      document.removeEventListener('keydown', start);
      overlay.remove();
      resolve();
    };

    document.addEventListener('click', start, { once: true });
    document.addEventListener('keydown', start, { once: true });
  });

  runBootSequence();
}
