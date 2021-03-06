const faunadb = require('faunadb');

const CLIENT = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
});

const q = faunadb.query;
const query = expression => CLIENT.query(expression);

// FaunaDB relies on integer IDs which can be specified. For simplicity sake,
// we will enforce unique usernames simply by converting them to an integer
// and using them as an ID directly.
const toId = (name) => String(parseInt(name.toLowerCase(), 36));

// All custom DB queries will keep with FaunaDB's capitalization convention.
const UserRef = id => q.Ref(q.Collection('users'), id);
const FarmRef = id => q.Ref(q.Collection('farms'), id);
const PondRef = id => q.Ref(q.Collection('ponds'), id);

const Normalize = (resource) => (
  q.Let(
    // Cache resource in Let to capture outputs of expressions without doubling
    { resource },
    q.Merge(
      q.Select(['data'], q.Var('resource')),
      { id: q.Select(['ref', 'id'], q.Var('resource')) },
    )
  )
);

const CreateNormal = (collection, data) => (
  Normalize(
    q.Create(
      q.Collection(collection),
      { data },
    ),
  )
);

const GetIndexedItems = (name, term) => (
  q.Map(
    q.Select(
      ['data'],
      q.Map(
        q.Paginate(q.Match(q.Index(name), term)),
        q.Lambda(['ref'], q.Get(q.Var('ref'))),
      ),
    ),
    q.Lambda(['doc'], Normalize(q.Var('doc'))),
  )
);

module.exports = {
  q,
  query,
  toId,
  UserRef,
  FarmRef,
  PondRef,
  Normalize,
  CreateNormal,
  GetIndexedItems,
};
