const PATH_VARS = {
  users: 'userId',
  farms: 'farmId',
  ponds: 'pondId',
};

const toSegments = (path) => {
  return path
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')
    .split('/');
};

const getPathVars = ({ path }) => {
  const segments = toSegments(path);
  const parsed = {};

  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i];
    const varName = PATH_VARS[segment];

    if (varName) {
      i += 1;
      parsed[varName] = segments[i];
    }
  }

  return parsed;
};

const wrapWith200 = (body) => ({
  statusCode: 200,
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

module.exports = {
  getPathVars,
  wrapWith200,
};
