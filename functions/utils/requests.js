const wrapWith200 = (body) => ({
  statusCode: 200,
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

module.exports = {
  wrapWith200,
};
