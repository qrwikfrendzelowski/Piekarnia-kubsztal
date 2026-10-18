const DATA_ROOT = new URL('../data/', import.meta.url);

/** Fetches and parses a JSON file from src/data. Pass a file name, not a path. */
export async function fetchData(fileName, { signal } = {}) {
  if (typeof fileName !== 'string' || !/^[\w-]+(?:\.json)?$/.test(fileName)) {
    throw new TypeError('Data file name must be a simple JSON file name.');
  }

  const file = fileName.endsWith('.json') ? fileName : `${fileName}.json`;
  const response = await fetch(new URL(file, DATA_ROOT), { signal, headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Unable to load ${file}: ${response.status} ${response.statusText}`);
  return response.json();
}

export const api = { fetchData };
