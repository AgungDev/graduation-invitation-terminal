import { state } from './state.js';
import { commandPanel, commandOutput } from './dom.js';

export const commandButtons = ['help', 'location'];

export function renderCommandPanel() {
  commandPanel.innerHTML = '';
  commandButtons.forEach(command => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'command-button';
    button.textContent = command;
    button.addEventListener('click', () => executeCommand(command));
    commandPanel.appendChild(button);
  });
}

export function showCommandResult(lines) {
  commandOutput.innerHTML = '';
  lines.forEach(line => {
    const row = document.createElement('div');
    row.textContent = line;
    commandOutput.appendChild(row);
  });
}

export function executeCommand(rawCommand) {
  const command = rawCommand.trim().toLowerCase();
  if (!command) return;

  if (command === 'clear') {
    commandOutput.innerHTML = '';
    return;
  }

  if (command === 'sudo celebrate') {
    showCommandResult(['Root access granted.', 'Launching celebration protocol...']);
    triggerConfetti();
    return;
  }

  if (command === 'location') {
    showCommandResult(['Opening Google Maps...']);
    openMapsLink();
    return;
  }

  if (command === 'help') {
    showCommandResult(['Opening WhatsApp help...']);
    openHelpLink();
    return;
  }

  if (command === 'rsvp') {
    showCommandResult(['Opening WhatsApp invitation link...']);
    openRsvpLink();
    return;
  }

  const response = getCommandResponse(command);
  if (response) {
    showCommandResult(response);
    return;
  }

  showCommandResult([`Command not found: ${command}`, 'Type help to see available commands.']);
}

function openMapsLink() {
  window.open(state.config.ADDRESS_MAPS, '_blank');
}

function openHelpLink() {
  const isSpecialGuest = !state.guestInfo || state.guestName.toLowerCase() === 'special guest';
  if (isSpecialGuest) {
    openSpecialGuestLink();
    return;
  }

  const message = encodeURIComponent('[help] Saya membutuhkan bantuan untuk undangan wisuda.');
  window.open(`https://wa.me/${state.config.PHONE}?text=${message}`, '_blank');
}

function openSpecialGuestLink() {
  const message = encodeURIComponent('[Special Guest]');
  window.open(`https://wa.me/${state.config.PHONE}?text=${message}`, '_blank');
}

function openRsvpLink() {
  const guestLabel = state.guestInfo?.position || state.guestName;
  const message = encodeURIComponent(`Halo ${state.config.NAME},\n\nSaya ${guestLabel}\nakan hadir pada acara wisuda.`);
  window.open(`https://wa.me/${state.config.PHONE}?text=${message}`, '_blank');
}

function getCommandResponse(command) {
  if (command === 'location') {
    return [state.config.ADDRESS, state.config.ADDRESS_MAPS];
  }

  if (command === 'graduate') {
    const guestLabel = state.guestInfo?.position || state.guestName;
    return [`Guest: ${guestLabel}`, state.config.DEGREE, 'Class of 2026'];
  }

  if (command === 'help') {
    return ['Available commands:', 'help', 'graduate', 'location', 'rsvp', 'achievement', 'quest', 'history'];
  }

  return state.commandResponses[command];
}

export function triggerConfetti() {
  const confettiCount = 60;
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    document.body.appendChild(confetti);
    const x = Math.random() * window.innerWidth;
    const delay = Math.random() * 0.5;
    confetti.style.left = `${x}px`;
    confetti.style.animationDelay = `${delay}s`;
    confetti.addEventListener('animationend', () => confetti.remove());
  }
}
