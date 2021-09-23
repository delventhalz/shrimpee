const HASH_ROUNDS = 10;
const TOKEN_KEY = 'authToken';

// Converts an ascii string to an integer using character code.
const toInt = str => {
  const hex = str
    .split('')
    .map(char => char.charCodeAt(0))
    .map(code => code.toString(16))
    .join('');

  return parseInt(hex, 16);
};

// Eventually this web app should be refactored to use some sort of
// server generated token rather than Basic Auth.
//
// In the meantime, I would prefer not to leave plaintext passwords at rest
// ANYWHERE, hence this hacky hashing algorithm. It is adapted from a seedable
// PRNG I've used a few times before, and will only be used when storing
// passwords locally on the client's machine.
const zcrypt = (password) => {
  let hash = toInt(password) % 2147483647;

  for (let i = 0; i < HASH_ROUNDS; i += 1) {
    hash = (hash * 16807) % 2147483647;
  }

  // Output will always be a 4-byte hash, formatted as a hex string
  return (hash + 268435456).toString(16);
};

export const toToken = (username, password) => {
  const credentials = `${username}:${zcrypt(password)}`;
  return `Basic ${window.btoa(credentials)}`;
}

export const setAuth = (username, password) => {
  const token = toToken(username, password);
  return window.localStorage.setItem(TOKEN_KEY, token);
};

export const getAuth = () => window.localStorage.getItem(TOKEN_KEY);
export const isAuthed = () => Boolean(getAuth());
export const clearAuth = () => window.localStorage.removeItem(TOKEN_KEY);
