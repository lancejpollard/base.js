
# Link Base for JavaScript

This is the base structure for storing, referencing, and managing data and functions in the link ecosystem (for JavaScript-land).

This layer just allows storing and fetching individual records by ID. It should be built upon to allow for range-based queries, join queries, and general queries and change operations. The layer on top of this for handling such queries and indexing can simply store and fetch the records by ID in this underlying system, in a scalable way. This layer doesn't need to include all that.

```js
const Base = require('@lancejpollard/link-base.js')

const base = new Base()

/**
 * Form name to ID mapping, this should be mapped to the database
 * IDs that represent these standard models.
 */

const FORM = {
  host: 0,
  deck: 1,
  file: 2,
  form: 3,
}

const MARK_BASE = {
  FORM_HOST: FORM.host,
  FORM_DECK: FORM.deck,
  FORM_FILE: FORM.file,
  FORM_FORM: FORM.form,
  HOST_BASE: 0, // @drumwork
  DECK_BASE_HOST_BASE: 0, // @drumwork/base
  FILE_LINK_DECK_BASE_HOST_BASE: 0, // @drumwork/base/link
}

/**
 * Way to easily reference ID by name, only useful for
 * things like this demo, since we are manually writing the IDs.
 *
 * Usually a database would just generate whats next, the MESH.
 */

const MARK = {
  ...MARK_BASE,
  HOST_MY_ORG: 1,
  DECK_MY_DECK_HOST_MY_ORG: 0,
  FILE_LINK_DECK_MY_DECK_HOST_MY_ORG: 0,
  FILE_EXAMPLE_DECK_MY_DECK_HOST_MY_ORG: 1,
  FILE_EXAMPLE_2_DECK_MY_DECK_HOST_MY_ORG: 2
}

/**
 * The mesh records we need to bootstrap the environment.
 *
 * This should be generated from your database.
 *
 * One record is created for each host/deck/file/form,
 * though the forms are all centrally standardized.
 *
 * By passing these into the system, the JS data structures
 * will get created for storing the records associated with each type.
 */

const MESH_BASE = [
  {
    // @drumwork host
    text: 'drumwork',
    host: m('HOST_BASE'),
    deck: m('DECK_BASE_HOST_BASE'),
    file: m('FILE_LINK_DECK_BASE_HOST_BASE'),
    form: m('FORM_HOST'),
    mark: m('HOST_BASE'),
  },
  {
    // @drumwork/base deck
    text: 'base',
    host: m('HOST_BASE'),
    deck: m('DECK_BASE_HOST_BASE'),
    file: m('FILE_LINK_DECK_BASE_HOST_BASE'),
    form: m('FORM_DECK'),
    mark: m('DECK_BASE_HOST_BASE'),
  },
  {
    // @drumwork/base/link file
    text: 'link',
    host: m('HOST_BASE'),
    deck: m('DECK_BASE_HOST_BASE'),
    file: m('FILE_LINK_DECK_BASE_HOST_BASE'),
    form: m('FORM_FILE'),
    mark: m('FILE_LINK_DECK_BASE_HOST_BASE'),
  },
  {
    // host form
    text: 'host',
    host: m('HOST_BASE'),
    deck: m('DECK_BASE_HOST_BASE'),
    file: m('FILE_LINK_DECK_BASE_HOST_BASE'),
    form: m('FORM_FORM'),
    mark: m('FORM_HOST'),
  },
  {
    // deck form
    text: 'deck',
    host: m('HOST_BASE'),
    deck: m('DECK_BASE_HOST_BASE'),
    file: m('FILE_LINK_DECK_BASE_HOST_BASE'),
    form: m('FORM_FORM'),
    mark: m('FORM_DECK'),
  },
  {
    // file form
    text: 'file',
    host: m('HOST_BASE'),
    deck: m('DECK_BASE_HOST_BASE'),
    file: m('FILE_LINK_DECK_BASE_HOST_BASE'),
    form: m('FORM_FORM'),
    mark: m('FORM_FILE'),
  },
  {
    // form form
    text: 'form',
    host: m('HOST_BASE'),
    deck: m('DECK_BASE_HOST_BASE'),
    file: m('FILE_LINK_DECK_BASE_HOST_BASE'),
    form: m('FORM_FORM'),
    mark: m('FORM_FORM'),
  },
]

const MESH = [
  ...MESH_BASE,
  {
    // 'myorg host',
    text: 'myorg',
    host: m('HOST_MY_ORG'),
    deck: m('DECK_MY_DECK_HOST_MY_ORG'),
    file: m('FILE_LINK_DECK_MY_DECK_HOST_MY_ORG'),
    form: m('FORM_HOST'),
    mark: m('HOST_MY_ORG'),
  },
  {
    // 'myorg mydeck deck',
    text: 'mydeck',
    host: m('HOST_MY_ORG'),
    deck: m('DECK_MY_DECK_HOST_MY_ORG'),
    file: m('FILE_LINK_DECK_MY_DECK_HOST_MY_ORG'),
    form: m('FORM_DECK'),
    mark: m('DECK_MY_DECK_HOST_MY_ORG'),
  },
  {
    // 'myorg mydeck link file',
    text: 'link',
    host: m('HOST_MY_ORG'),
    deck: m('DECK_MY_DECK_HOST_MY_ORG'),
    file: m('FILE_LINK_DECK_MY_DECK_HOST_MY_ORG'),
    form: m('FORM_FILE'),
    mark: m('FILE_LINK_DECK_MY_DECK_HOST_MY_ORG'),
  },
  {
    // 'myorg mydeck example file',
    text: 'example-file',
    host: m('HOST_MY_ORG'),
    deck: m('DECK_MY_DECK_HOST_MY_ORG'),
    file: m('FILE_LINK_DECK_MY_DECK_HOST_MY_ORG'),
    form: m('FORM_FILE'),
    mark: m('FILE_EXAMPLE_DECK_MY_DECK_HOST_MY_ORG'),
  },
  {
    // 'myorg mydeck example file 2',
    text: 'example-file-2',
    host: m('HOST_MY_ORG'),
    deck: m('DECK_MY_DECK_HOST_MY_ORG'),
    file: m('FILE_LINK_DECK_MY_DECK_HOST_MY_ORG'),
    form: m('FORM_FILE'),
    mark: m('FILE_EXAMPLE_2_DECK_MY_DECK_HOST_MY_ORG'),
  }
]

/**
 * Also specify the "base" records, so we can
 * know how/where to find the forms.
 */

base.fuse({
  host: m('HOST_BASE'),
  deck: m('DECK_BASE_HOST_BASE'),
  file: m('FILE_LINK_DECK_BASE_HOST_BASE'),
  form: FORM,
  mesh: MESH,
})

/**
 * Then to our actual module definitions.
 *
 * This will be generated by a code generator
 * which generates JS code from Link Text.
 */

base.cast('@myorg/mydeck/example-file', file => {
  file.task('my-task', text => {
    console.log(`message: ${text}`)
  })
})

base.cast('@myorg/mydeck/example-file-2', file => {
  file.task('my-task', text => {
    console.log(`message: ${text}`)
  })
})

/**
 * You can optionally debug and call methods globally.
 */

base.bind('@myorg/mydeck/example-file').call('my-task', 'foo')

console.log(base.read(...base.bind('@myorg/mydeck/example-file-2').line()).text)

function m(name) {
  if (!MARK.hasOwnProperty(name)) {
    throw new Error(`MARK ${name} undefined.`)
  }

  return MARK[name]
}
```

## Implementation Details

Every object/record is a "mesh". It is uniquely identified by 5 _marks_:

1. host: The ID of the organization which controls the entity.
2. deck: The ID of the organization project/repo which controls the entity.
3. file: The ID of the file in the repo which controls the entity (a "group" basically).
4. form: The ID of the type of record. Type IDs are defined globally.
5. mesh: The ID of the mesh itself, relative to these other 4 IDs.

So essentially we just have a system where you can create/select/remove records by this 5-tuple. That's it.

You would then build a layer on top of this to be one aspect of a distributed query, and build the appropriate indexing structures and such. Those can all be implemented as "modules" within this library. We are working on writing modules in Link Text and then compiling them down to this Base code. That will be the base compiler for link text.
