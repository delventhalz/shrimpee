const { asAuthedUser } = require('./utils/auth.js');
const {
  q,
  query,
  FarmRef,
  CreateNormal,
} = require('./utils/db.js');
const { getPathVars, wrapWith200 } = require('./utils/requests.js');

const ResizeFarm = (farmId, delta) => (
  q.Update(
    FarmRef(farmId),
    {
      data: {
        size: q.Add(
          delta,
          q.Select(['data', 'size'], q.Get(FarmRef(farmId))),
        ),
      },
    },
  )
);

// Create a new pond, update parent farm's size, finally return the new pond
const CreatePond = (userId, farmId, data) => (
  q.Let(
    {
      output: CreateNormal('ponds', {
        ...data,
        owner: userId,
        farm: farmId,
      }),
    },
    q.Do(
      ResizeFarm(farmId, data.size || 0),
      q.Var('output'),
    ),
  )
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
