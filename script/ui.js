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

export function renderTextFake(item) {
  const line = document.createElement('div');
  line.className = 'terminal-line';
  const openBracket = document.createElement('span');
  openBracket.textContent = '[';
  const statusSpan = document.createElement('span');
  statusSpan.textContent = item.success ? ' OK ' : ' ERROR ';
  statusSpan.className = item.success ? 'status-ok' : 'status-error';
  const closeBracket = document.createElement('span');
  closeBracket.textContent = ']';
  const textSpan = document.createElement('span');
  textSpan.textContent = ` ${item.text}`;

  line.appendChild(openBracket);
  line.appendChild(statusSpan);
  line.appendChild(closeBracket);
  line.appendChild(textSpan);
  terminalContent.appendChild(line);
  terminalScreen.scrollTop = terminalScreen.scrollHeight;
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

export async function runCheckFake(item) {
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

  // Animate through keys without validation
  for (const key of keys) {
    detailText.textContent = ` checking ${key}`;
    for (let i = 0; i < 5; i++) {
      statusSpan.textContent = spinner[i % spinner.length];
      await sleep(100);
    }
  }

  // Always show OK (no actual validation)
  statusSpan.textContent = ' OK ';
  statusSpan.className = 'status-ok';
  detailText.textContent = '';
  return { success: true };
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

async function playBootlineMusic(label) {
  const line = document.createElement('div');
  line.className = 'terminal-line';
  const openBracket = document.createElement('span'); openBracket.textContent = '[';
  const statusSpan = document.createElement('span'); statusSpan.textContent = ' \\ ';
  const closeBracket = document.createElement('span'); closeBracket.textContent = ']';
  const labelText = document.createElement('span'); labelText.textContent = ` ${label}`;
  const detailText = document.createElement('span'); detailText.className = 'boot-loading-detail'; detailText.textContent = ' loading...';

  line.appendChild(openBracket);
  line.appendChild(statusSpan);
  line.appendChild(closeBracket);
  line.appendChild(labelText);
  line.appendChild(detailText);
  terminalContent.appendChild(line);
  terminalScreen.scrollTop = terminalScreen.scrollHeight;

  const spinner = [' \\ ', ' / '];
  const spinnerInterval = setInterval(() => {
    statusSpan.textContent = spinner[Math.floor(Date.now() / 100) % spinner.length];
  }, 100);

  try {
    const audio = new Audio('assets/musik.mp3');
    audio.preload = 'auto';
    console.log('[Audio] Loading assets/musik.mp3...');

    // 1) Try unmuted play first
    try {
      console.log('[Audio] Attempting unmuted play...');
      await audio.play();
      console.log('[Audio] Unmuted play succeeded!');
      clearInterval(spinnerInterval);
      statusSpan.textContent = ' OK ';
      statusSpan.className = 'status-ok';
      detailText.textContent = '';
      state.backgroundAudio = audio;
      terminalScreen.scrollTop = terminalScreen.scrollHeight;
      return;
    } catch (err) {
      console.warn('[Audio] Unmuted play failed:', err);
      // fallback to muted autoplay
    }

    try {
      console.log('[Audio] Attempting muted autoplay...');
      audio.muted = true;
      await audio.play();
      console.log('[Audio] Muted autoplay succeeded, attempting to unmute...');
      // attempt to unmute programmatically a few times
      let unmuted = false;
      for (let i = 0; i < 5; i++) {
        await new Promise(r => setTimeout(r, 300));
        try {
          audio.muted = false;
          await audio.play();
          unmuted = true;
          break;
        } catch (e) {
          audio.muted = true; // revert to keep playing muted
        }
      }

      clearInterval(spinnerInterval);
      if (unmuted) {
        console.log('[Audio] Successfully unmuted!');
        statusSpan.textContent = ' OK ';
        statusSpan.className = 'status-ok';
        detailText.textContent = '';
        state.backgroundAudio = audio;
      } else {
        console.warn('[Audio] Could not unmute after 5 attempts');
        statusSpan.textContent = ' ERROR ';
        statusSpan.className = 'status-error';
        detailText.textContent = '';
        addLine('  • Autoplay blocked — cannot unmute without user interaction');
      }
      terminalScreen.scrollTop = terminalScreen.scrollHeight;
      return;
    } catch (e) {
      console.error('[Audio] Muted autoplay failed:', e);
      clearInterval(spinnerInterval);
      statusSpan.textContent = ' ERROR ';
      statusSpan.className = 'status-error';
      detailText.textContent = '';
      terminalScreen.scrollTop = terminalScreen.scrollHeight;
      addLine('  • Failed to load musik.mp3');
      return;
    }
  } catch (e) {
    console.error('[Audio] Initialization error:', e);
    clearInterval(spinnerInterval);
    statusSpan.textContent = ' ERROR ';
    statusSpan.className = 'status-error';
    detailText.textContent = '';
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
    addLine('  • Failed to initialize audio');
    return;
  }
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
    console.log('[Boot] Processing item:', item.type, item.label);
    if (item.type === 'text') {
      let lineText = item.text || '';
      if (lineText.includes('${guestName}')) {
        lineText = lineText.replace(/\$\{guestName\}/g, state.guestName);
      }
      if (lineText === '') {
        addLine('');
      } else if (lineText.toLowerCase().includes('musik')) {
        await playBootlineMusic(lineText);
      } else {
        await typeLine(lineText, 28);
      }
      await sleep(120);
      continue;
    }

    if (item.type === 'text_fake') {
      renderTextFake(item);
      await sleep(120);
      continue;
    }

    if (item.type === 'check_fake') {
      await runCheckFake(item);
      terminalScreen.scrollTop = terminalScreen.scrollHeight;
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
