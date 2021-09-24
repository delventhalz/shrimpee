const { asAuthedUser } = require('./utils/auth.js');
const { q, query, FarmRef } = require('./utils/db.js');
const { getPathVars, wrapWith200 } = require('./utils/requests.js');

const GetUserFarms = (userId) => (
  q.Select(
    ['data'],
    q.Map(
      q.Paginate(q.Match(q.Index('farms_by_owner'), userId)),
      q.Lambda('farmRef', q.Get(q.Var('farmRef'))),
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

const UpdateFarm = (farmId, data) => (
  q.Update(
    FarmRef(farmId),
    { data },
  )
);

const DeleteFarm = (farmId) => (
  q.Delete(FarmRef(farmId))
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

const putFarm = asAuthedUser(async (event) => {
  // The path id is the source of truth
  const { farmId } = getPathVars(event);
  const { id, ...farm } = JSON.parse(event.body);

  const updatedFarm = await query(UpdateFarm(farmId, farm));
  return wrapWith200(normalizeFarm(updatedFarm));
});

const deleteFarm = asAuthedUser(async (event) => {
  const { farmId } = getPathVars(event);
  await query(DeleteFarm(farmId));
  return { statusCode: 204 };
});

exports.handler = (event) => {
  switch (event.httpMethod) {
    case 'GET':
      return getFarms(event);
    case 'POST':
      return postFarm(event);
    case 'PUT':
      return putFarm(event);
    case 'DELETE':
      return deleteFarm(event);
    default:
      throw new Error(`Method not supported: ${event.httpMethod}`);
  }
};
