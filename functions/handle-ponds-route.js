const { asAuthedUser } = require('./utils/auth.js');
const { q, query, CreateNormal } = require('./utils/db.js');
const { getPathVars, wrapWith200 } = require('./utils/requests.js');

const CreatePond = (userId, farmId, data) => (
  CreateNormal('ponds', {
    ...data,
    owner: userId,
    farm: farmId,
  })
);

const postPond = asAuthedUser(async (event) => {
  const { userId, body } = event;
  const { farmId } = getPathVars(event);

  const pond = await query(CreatePond(userId, farmId, JSON.parse(body)));

  return wrapWith200(pond);
});

exports.handler = (event) => {
  switch (event.httpMethod) {
    case 'POST':
      return postPond(event);
    default:
      throw new Error(`Method not supported: ${event.httpMethod}`);
  }
};
