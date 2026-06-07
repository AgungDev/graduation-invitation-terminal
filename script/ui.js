import { state, queryParams } from './state.js';
import { evaluateBootCheck } from './validators.js';
import { sleep } from './utils.js';
import {
  terminalContent,
  terminalScreen,
  terminalFrame,
  invitationCard,
  guestNameElement,
  guestRoleElement,
  graduateNameElement,
  degreeValue,
  universityValue,
  dateValue,
  timeValue,
  venueValue,
  footerAddress,
  commandPanel
} from './dom.js';

export function addLine(text = '', className = '') {
  const line = document.createElement('div');
  line.className = 'terminal-line';
  if (className) {
    line.classList.add(className);
  }
  line.textContent = text;
  terminalContent.appendChild(line);
  terminalScreen.scrollTop = terminalScreen.scrollHeight;
}

export async function typeLine(text, speed = 32) {
  const line = document.createElement('div');
  line.className = 'terminal-line';
  terminalContent.appendChild(line);
  terminalScreen.scrollTop = terminalScreen.scrollHeight;
  for (const char of text) {
    line.textContent += char;
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
    await sleep(speed + Math.random() * 40);
  }
  await sleep(120);
}

export function renderBootCheckResult(item, result) {
  const line = document.createElement('div');
  line.className = 'terminal-line';
  const openBracket = document.createElement('span');
  openBracket.textContent = '[';
  const statusSpan = document.createElement('span');
  statusSpan.textContent = result.success ? ' OK ' : ' ERROR ';
  statusSpan.className = result.success ? 'status-ok' : 'status-error';
  const closeBracket = document.createElement('span');
  closeBracket.textContent = ']';

  line.appendChild(openBracket);
  line.appendChild(statusSpan);
  line.appendChild(closeBracket);
  line.appendChild(document.createTextNode(` ${item.label}`));
  terminalContent.appendChild(line);

  if (!result.success && result.errors.length) {
    result.errors.forEach(error => addLine(`  • ${error}`));
  }
}

export async function runConfigCheck(item) {
  const line = document.createElement('div');
  line.className = 'terminal-line';
  const openBracket = document.createElement('span');
  openBracket.textContent = '[';
  const statusSpan = document.createElement('span');
  statusSpan.textContent = ' \\ ';
  const closeBracket = document.createElement('span');
  closeBracket.textContent = ']';
  const labelText = document.createElement('span');
  labelText.textContent = ` ${item.label}`;
  const detailText = document.createElement('span');
  detailText.textContent = ' checking...';
  detailText.className = 'boot-loading-detail';

  line.appendChild(openBracket);
  line.appendChild(statusSpan);
  line.appendChild(closeBracket);
  line.appendChild(labelText);
  line.appendChild(detailText);
  terminalContent.appendChild(line);
  terminalScreen.scrollTop = terminalScreen.scrollHeight;

  const keys = item.keys || [];
  const spinner = [' \\ ', ' / '];

  for (const key of keys) {
    detailText.textContent = ` checking ${key}`;
    for (let i = 0; i < 5; i++) {
      statusSpan.textContent = spinner[i % spinner.length];
      await sleep(100);
    }
  }

  const result = evaluateBootCheck(item);
  statusSpan.textContent = result.success ? ' OK ' : ' ERROR ';
  statusSpan.className = result.success ? 'status-ok' : 'status-error';
  detailText.textContent = '';

  if (!result.success && result.errors.length) {
    result.errors.forEach(error => addLine(`  • ${error}`));
  }
  return result;
}

function createTerminalHelpLink(prefixLabel, linkLabel, url) {
  const line = document.createElement('div');
  line.className = 'terminal-line';
  const prefix = document.createTextNode(`  • ${prefixLabel}`);
  const anchor = document.createElement('a');
  anchor.className = 'terminal-link';
  anchor.textContent = linkLabel;
  anchor.href = url;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';

  line.appendChild(prefix);
  line.appendChild(anchor);
  terminalContent.appendChild(line);
  terminalScreen.scrollTop = terminalScreen.scrollHeight;
}

async function runAuthCheck(item) {
  const line = document.createElement('div');
  line.className = 'terminal-line';
  const openBracket = document.createElement('span');
  openBracket.textContent = '[';
  const statusSpan = document.createElement('span');
  statusSpan.textContent = ' \\ ';
  const closeBracket = document.createElement('span');
  closeBracket.textContent = ']';
  const labelText = document.createElement('span');
  labelText.textContent = ` ${item.label}`;
  const detailText = document.createElement('span');
  detailText.textContent = ' checking authorization...';
  detailText.className = 'boot-loading-detail';

  line.appendChild(openBracket);
  line.appendChild(statusSpan);
  line.appendChild(closeBracket);
  line.appendChild(labelText);
  line.appendChild(detailText);
  terminalContent.appendChild(line);
  terminalScreen.scrollTop = terminalScreen.scrollHeight;

  const spinner = [' \\ ', ' / '];
  for (let i = 0; i < 20; i++) {
    statusSpan.textContent = spinner[i % spinner.length];
    await sleep(100);
  }

  const result = evaluateBootCheck(item);
  statusSpan.textContent = result.success ? ' OK ' : ' ERROR ';
  statusSpan.className = result.success ? 'status-ok' : 'status-error';
  detailText.textContent = '';

  if (!result.success && result.errors.length) {
    result.errors.forEach(error => addLine(`  • ${error}`));

    if (item.check === 'authorizationGuest' || item.check === 'authenticationGuest') {
      const message = item.check === 'authenticationGuest'
        ? encodeURIComponent('[Special Guest] Authentication')
        : encodeURIComponent(`[Special Guest] ${state.guestName} not authorized`);
      const helpUrl = `https://wa.me/${state.config.PHONE}?text=${message}`;
      createTerminalHelpLink('Help: ', '[Whatsapp]', helpUrl);
    }
  }
  return result;
}

export async function runBootSequence() {
  if (!state.bootLinesConfig.length) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    const openBracket = document.createElement('span');
    openBracket.textContent = '[';
    const statusSpan = document.createElement('span');
    statusSpan.textContent = ' ERROR ';
    statusSpan.className = 'status-error';
    const closeBracket = document.createElement('span');
    closeBracket.textContent = ']';
    line.appendChild(openBracket);
    line.appendChild(statusSpan);
    line.appendChild(closeBracket);
    line.appendChild(document.createTextNode(' Boot sequence config not loaded'));
    terminalContent.appendChild(line);
    console.warn('bootLinesConfig is empty:', state.bootLinesConfig);
    commandPanel.classList.add('visible');
    return;
  }

  const bootLines = state.bootLinesConfig;
  let bootHalted = false;

  for (const item of bootLines) {
    if (item.type === 'text') {
      let lineText = item.text || '';
      if (lineText.includes('${guestName}')) {
        lineText = lineText.replace(/\$\{guestName\}/g, state.guestName);
      }
      if (lineText === '') {
        addLine('');
      } else {
        await typeLine(lineText, 28);
      }
      await sleep(120);
      continue;
    }

    if (item.type === 'check') {
      if (item.check === 'config') {
        await runConfigCheck(item);
        terminalScreen.scrollTop = terminalScreen.scrollHeight;
        continue;
      }

      if (item.check === 'authorizationGuest' || item.check === 'authenticationGuest') {
        const result = await runAuthCheck(item);
        terminalScreen.scrollTop = terminalScreen.scrollHeight;
        await sleep(120);
        if (!result.success) {
          bootHalted = true;
          break;
        }
        continue;
      }

      const result = evaluateBootCheck(item);
      renderBootCheckResult(item, result);
      terminalScreen.scrollTop = terminalScreen.scrollHeight;
      await sleep(120);
      if (!result.success) {
        bootHalted = true;
        break;
      }
      continue;
    }

    await typeLine(item.text || '', 28);
    await sleep(120);
  }

  await sleep(1500);
  commandPanel.classList.add('visible');

  if (!bootHalted && state.guestInfo) {
    invitationCard.classList.add('visible');
    terminalFrame.classList.add('dimmed');
    state.isBootComplete = true;
  }
}

export function setupGuest() {
  const raw = queryParams.get('to') || '';
  const decoded = raw ? decodeURIComponent(raw.replace(/\+/g, ' ')).trim() : '';
  state.guestName = decoded || 'Special Guest';
  const normalizedGuest = state.guestName.toLowerCase();
  state.guestInfo = state.guests.find(g => g.slug.toLowerCase() === normalizedGuest);

  const greeting = state.guestInfo?.position
    ? `Welcome,\n${state.guestInfo.position}`
    : `Welcome, ${state.guestName}`;
  guestNameElement.textContent = greeting;
  guestRoleElement.textContent = state.guestInfo?.category ? state.guestInfo.category.toUpperCase() : '';
  guestRoleElement.style.display = state.guestInfo?.category ? 'block' : 'none';
}

export function updateInvitationDetails() {
  graduateNameElement.textContent = state.config.NAME;
  degreeValue.textContent = state.config.DEGREE;
  universityValue.textContent = state.config.UNIVERSITY;
  dateValue.textContent = state.config.DATE;
  timeValue.textContent = state.config.TIME;
  venueValue.textContent = state.config.ADDRESS;
  document.getElementById('graduationTitle').textContent = state.config.GRADUATION_TITLE;
  footerAddress.textContent = state.config.ADDRESS;
}
