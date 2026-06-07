export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function loadJsonFile(path, name) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      console.warn(`${name} not found:`, response.status, response.statusText);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.warn(`Could not load ${name}:`, error);
    return null;
  }
}
