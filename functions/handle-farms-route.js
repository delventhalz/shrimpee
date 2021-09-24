const { asAuthedUser } = require('./utils/auth.js');
const { q, query } = require('./utils/db.js');
const { wrapWith200 } = require('./utils/requests.js');

const GetUserFarms = (userId) => (
  q.Select(
    ['data'],
    q.Filter(
      q.Map(
        q.Paginate(q.Documents(q.Collection('farms'))),
        q.Lambda('farmRef', q.Get(q.Var('farmRef'))),
      ),
      q.Lambda(
        'farm',
        q.Equals(
          userId,
          q.Select(['data', 'owner'], q.Var('farm')),
        ),
      ),
    ),
  )
);

const CreateFarm = (userId, data) => (
  q.Create(
    q.Collection('farms'),
    {
      data: {
        owner: userId,
        ...data,
      },
    },
  )
);

const normalizeFarm = ({ ref, data }) => ({
  id: ref.id,
  ...data,
});

const getFarms = asAuthedUser(async ({ userId }) => {
  const farms = await query(GetUserFarms(userId));
  return wrapWith200(farms.map(normalizeFarm));
});

const postFarm = asAuthedUser(async ({ userId, body }) => {
  const farm = await query(CreateFarm(userId, JSON.parse(body)));
  return wrapWith200(normalizeFarm(farm));
});

exports.handler = (event) => {
  switch (event.httpMethod) {
    case 'GET':
      return getFarms(event);
    case 'POST':
      return postFarm(event);
    default:
      throw new Error(`Method not supported: ${event.httpMethod}`);
  }
};
