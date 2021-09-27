# shrimpee

_Shrimpee_ is quick coding demonstration based on the idea of managing shrimp
farms. It allows users to create an account, add farms to their account, and
add shrimp ponds to their farms. In addition to a name/description, ponds have
a size in hectares, and farms have a size which is the sum of their ponds.

The app is only a day or so worth of work, and so there is a minimum of error
handling, but you can play around with it yourself at:

[https://shrimpee.netlify.app](https://shrimpee.netlify.app)

## The Stack

For simplicity's sake, Shrimpee runs without a build step and with a minimum of
dependencies. I focused particularly on tools I already knew and was reasonably
familiar with.

### Netlify

Both the [frontend](./public) and [backend](./functions) are hosted on
[Netlify](https://www.netlify.com/). Netlify is tough to beat as a fast and
easy hosting service, though their "sensible defaults" do not work well for
building a RESTful API. In order achieve RESTful routes, I used a combination
of [redirects](./netlify.toml) and
[method routing](./functions/handle-farms-route.js#L81). It's a bit hacky, but
reliably achieves the goal.

### FaunaDB

I love [FaunaDB](https://fauna.com/) both for its ease of setup (particularly
when working with Netlify), and for the Lisp-based
[FQL](https://docs.fauna.com/fauna/current/api/fql/cheat_sheet) querying
language it uses. Beyond FQL, it is your basic NoSQL setup.

### Mithril.js

[Mithril.js](https://mithril.js.org/) is an MVC in a similar vein to React. It
features a virtual DOM, one-way data binding, and JS-based DOM element
definitions. With a tiny API, it is quick to pick up and simple to use. One
advantage it has over React is the option to use
[HyperScript](https://github.com/hyperhype/hyperscript) to define DOM nodes.
HyperScript is nothing more than simple JS functions, so unlike JSX it does not
require a build step.

### Bootstrap

The app has a minimum of styling, but [Bootstrap](https://getbootstrap.com/)
provides some defaults that are reasonably attractive.

### Bcrypt

The app uses a quick Basic Auth implementation to allow for a multi-user
environment. Although this is a demo app, care was taken to avoid storing plain
text passwords at rest anywhere. On the backend,
[bcrypt](https://github.com/kelektiv/node.bcrypt.js) is a straightforward
industry staple for this purpose.

On the frontend, passwords are persisted in localStorage, where I am less
concerned about security but still wanted to avoid plain text. As a quick hack
that avoided any new dependencies, I wrote
[zcrypt](./public/app/services/auth.js#L22), which uses a simple PRNG algorithm
to generate a marginally secure hash of the user's password for storage.

## Next Steps

State management is currently handled entirely on the component level, which
has gotten extremely unwieldy even in this simple example. Were I to work on
this further, the next step would be bringing in [Redux](https://redux.js.org/)
or some similar global state management library.
