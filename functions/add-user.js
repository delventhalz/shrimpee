const { hash } = require('./utils/auth.js');
const {
  q,
  query,
  toId,
  UserRef,
} = require('./utils/db.js');

// Omit password from user
const sanitizeUser = ({ password, ...user }) => user;

const CreateUser = (id, data) => (
  q.Select(
    ['data'],
    q.Create(UserRef(id), { data }),
  )
);

exports.handler = async ({ body }) => {
  const { username, password } = JSON.parse(body);

  const id = toId(username);
  const hashed = await hash(password);

  const user = await query(CreateUser(id, {
    username,
    password: hashed
  }));

  return {
    statusCode: 200,
    body: JSON.stringify(sanitizeUser(user)),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};
