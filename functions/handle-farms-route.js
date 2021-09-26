const { asAuthedUser } = require('./utils/auth.js');
const {
  q,
  query,
  FarmRef,
  Normalize,
  CreateNormal,
  GetIndexedItems,
} = require('./utils/db.js');
const { getPathVars, wrapWith200 } = require('./utils/requests.js');

const GetUserFarms = (userId) => (
  q.Map(
    GetIndexedItems('farms_by_owner', userId),
    q.Lambda(
      ['farm'],
      q.Merge(
        q.Var('farm'),
        {
          ponds: GetIndexedItems('ponds_by_farm', q.Select(['id'], q.Var('farm'))),
        },
      ),
    ),
  )
);

const CreateFarm = (userId, data) => (
  CreateNormal('farms', {
    ...data,
    owner: userId
  })
);

const UpdateFarm = (farmId, data) => (
  Normalize(
    q.Update(
      FarmRef(farmId),
      { data },
    ),
  )
);

const DeleteFarm = (farmId) => (
  q.Delete(FarmRef(farmId))
);

const getFarms = asAuthedUser(async ({ userId }) => {
  const farms = await query(GetUserFarms(userId));

  const sizedFarms = farms.map((farm) => {
    const size = farm.ponds
      .map(pond => pond.size)
      .reduce((total, pondSize) => total + pondSize, 0);

    return { ...farm, size };
  });

  return wrapWith200(sizedFarms);
});

const postFarm = asAuthedUser(async ({ userId, body }) => {
  const farm = await query(CreateFarm(userId, JSON.parse(body)));
  return wrapWith200(farm);
});

const putFarm = asAuthedUser(async (event) => {
  // The path id is the source of truth
  const { farmId } = getPathVars(event);
  const { id, ...farm } = JSON.parse(event.body);

  const updatedFarm = await query(UpdateFarm(farmId, farm));
  return wrapWith200(updatedFarm);
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
