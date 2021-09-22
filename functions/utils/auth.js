const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const hash = (text) => bcrypt.hash(text, SALT_ROUNDS);
const compare = (text, hashed) => bcrypt.compare(text, hashed);

module.exports = {
  hash,
  compare,
};
