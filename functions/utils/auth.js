const bcrypt = require('bcrypt');
const {
  q,
  query,
  toId,
  UserRef,
} = require('./db.js');

const SALT_ROUNDS = 10;

const hash = (text) => bcrypt.hash(text, SALT_ROUNDS);
const compare = (text, hashed) => bcrypt.compare(text, hashed);

const GetPassword = (userId) => (
  q.Select(
    ['data', 'password'],
    q.Get(UserRef(userId)),
  )
);

const parseToken = (token) => {
  const [_, encoded] = token.match(/^Basic (.+)$/);
  const credentials = Buffer.from(encoded, 'base64').toString();
  const [__, username, password] = credentials.match(/^(.+):(.+)$/);

  return {
    userId: toId(username),
    password,
  };
};

const isValidPassword = async (userId, password) => {
  const hashedPass = await query(GetPassword(userId));
  return compare(password, hashedPass);
};

const asAuthedUser = (eventHandler) => async (event) => {
  const { userId, password } = parseToken(event.headers.authorization);
  const isAuthorized = await isValidPassword(userId, password);

  if (!isAuthorized) {
    throw new Error('Naughty!!!');
  }

  return eventHandler({ userId, ...event });
};

module.exports = {
  hash,
  compare,
  parseToken,
  isValidPassword,
  asAuthedUser,
};
