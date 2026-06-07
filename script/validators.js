import { state, queryParams } from './state.js';

export function isNonEmptyString(value) {
  return value != null && String(value).trim() !== '';
}

export function validateConfigFields(keys) {
  const missing = [];
  const empty = [];

  keys.forEach(key => {
    if (!(key in state.config)) {
      missing.push(key);
    } else if (!isNonEmptyString(state.config[key])) {
      empty.push(key);
    }
  });

  const errors = [];
  if (missing.length) errors.push(`missing: ${missing.join(', ')}`);
  if (empty.length) errors.push(`empty: ${empty.join(', ')}`);

  return {
    success: missing.length === 0 && empty.length === 0,
    errors
  };
}

export function evaluateBootCheck(item) {
  if (item.type !== 'check') return { success: false, errors: ['invalid check'] };

  if (item.check === 'config') {
    return validateConfigFields(item.keys || []);
  }

  if (item.check === 'guests') {
    const success = Array.isArray(state.guests) && state.guests.length > 0;
    return { success, errors: success ? [] : ['guest list is empty'] };
  }

  if (item.check === 'commandResponses') {
    const success = state.commandResponses && Object.keys(state.commandResponses).length > 0;
    return { success, errors: success ? [] : ['commandResponses is empty'] };
  }

  if (item.check === 'guest') {
    const success = state.guestInfo != null;
    return { success, errors: success ? [] : ['guest not found in whitelist'] };
  }

  if (item.check === 'authenticationGuest') {
    const success = queryParams.has('to');
    return { success, errors: success ? [] : ['missing to query parameter'] };
  }

  if (item.check === 'authorizationGuest') {
    const success = state.guestInfo != null;
    const errors = [];
    if (!success) {
      const name = state.guestName || 'Guest';
      errors.push(`guest ${name} not authorized`);
    }
    return { success, errors };
  }

  return { success: false, errors: [`unknown check: ${item.check}`] };
}
