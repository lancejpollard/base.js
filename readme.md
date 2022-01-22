
# Link Base for JavaScript

This is the base structure for storing, referencing, and managing data and functions in the link ecosystem (for JavaScript-land).

```js
const Base = require('.')

const base = new Base()

/**
 * What are the actual data IDs here.
 */

base.note({
  form: [
    {
      name: 'user', mark: 102345
    },
    {
      name: 'other', mark: 101939
    }
  ],
  host: [
    {
      name: 'myorg',
      mark: 123,
      site: [
        {
          name: 'mysite',
          mark: 456,
          list: [
            {
              mark: 12121
            },
            {
              mark: 12124
            }
          ]
        }
      ]
    }
  ]
})

/**
 * Define a file.
 */

base.cast('@myorg/mysite/example-file', file => {
  file.task('my-task', text => {
    console.log(`message: ${text}`)
  })
})

base.cast('@myorg/mysite/example-file-2', file => {
  // file.form('user').save([...]) is an alternative for list(0)
  file.form('user').list(0).save([
    { mark: 1, link: { email: 'foo@bar.com' } },
    { mark: 1001, link: { email: 'hello@world.com' } },
  ])
})

/**
 * Example of how to bind and reach a file for internal use or debugging.
 */

base.bind('@myorg/mysite/example-file').call('my-task', 'foo')

console.log(base.bind('@myorg/mysite/example-file-2').line())
```

## Implementation Details

There is a tree of data stored, based on how you look at it.

It is defined from a visible scope perspective.

There is a base data model the link base compiler uses for all objects in the system.

Some things are highly localized and need to be optimized. But otherwise you should think of everything as identifiable objects, with their own ids. If something needs to be optimized, you can drop into lower level programming like with direct array usage on integers, or webgl type of stuff as well.

There are permanent database stored things (like what weave.js deals with), and then there are temporary in-memory structures that the program uses, but with their own ids (or optimized stuff doesn't even use ids). These temporary in-memory objects form a tree, so everything is accessible directly from top-down.

```
base
  host (organization)
    site (project)
      file (group/chunk)
        form (type)
          stemRank1
            stemRank2
              ...
```

So to access `stemRank1`, you might do:

```
base.read(1, 3, 2, 16, 10123)
```

This to some degree is similar to how weave.js does a lookup for a `stem`, based on it's "prime". The `mark` is the integer-sized ID for a specific record. The `line` of the record is how you get from the base to the object.

This means that these standard objects have an internal structure.

```js
{
  mark: integerID,
  base: parentLink,
  link: {
    [name]: stem
  },
  stem: [
    stem,
    ...
  ]
}
```

The `stem` is where things are findable by integer id, and the `link` are where named properties are.

This is just like weave.js, where things are indexed using these 4 properties:

- organization id (biginteger possibilities)
- project id (integer possibilities)
- chunk id (biginteger possibilities, the file)
- type id (integer possibilities)

In this case, the "chunk id" corresponds to the file id. Each file can then contain bigint child records per type, which is way more than enough. In practice, it is probably initially limited to whatever the array limit size is in JavaScript.

Use a map to store the keys.

Anything nested further is stored by named key or index if an array. But the objects stored nested in there will also potentially  have an ID, so they will be stored in n + 1 ways. This way you can reference the objects efficiently even if they are moved around.

When you bootstrap the base, you tell it what the database IDs are of the forms and the hosts and sites. You also tell it the list id for the specific chunk on a per type basis. This is all just metadata loaded in at the beginning, so it can be very compact.

```
[
  form,
  host
]

[
  [],
  [
    site
  ]
]
```

Also need to load the keys we are going to use in the system.

The records are wrapped in a mesh so you can save them with ID, and get the list of ids associated with the record.

For a given system, you can't change the IDs of the types or the chunks or the organizations or the projects, those are all constant. You can however change the names. So check the id and possibly change the name when bootstrapping.

Also, you may load the same types multiple times (such as if you make requests for some data, and it also includes the type information in case it is not present). In that case, just merge it in.

## Base Internal Structure

The base structure is pretty much as follows:

```
base.link.set(hostName, hostForm)
  => specific host form specific to @drumwork/base/host file
    => file.link.set('host', hostForm)
      => site is siteForm, from @drumwork/base/site file
      => site.link.set('host', @drumwork/base/host file)
        => host is hostFrom, from the drumwork/base/host file
        => host.link.set('base', @drumwork/base siteForm)
          => base.link.set('drumwork', @drumwork host)
host.link.set(siteName, siteForm)
  => specific site form specific to @drumwork/base/site file
    => file.link.set('site', siteForm)
```

So the base -> host -> site -> form are just shortcuts to forms on the main site.

There are also the mesh records too, for each form.

```
base.cast(path, task)
  => calls base.save(file), it is just different abstractoin for readability
base.free(path)
  => releases the file and memory
base.save(mesh)
  => stores to host/site/file/form of the corresponding type
base.read(query)
  => makes a query against the data.
base.test(query)
  => see if something exists
base.kick(query)
  => get rid of stuff
base.wire(path)
  => wires up the file.
base.fuse(config)
  => specifies the starting IDs for the base objects.
```

## Conclusion

Overall, there is a circular sort of system at the base.

- base has a bunch of hosts
- those base hosts are nested inside a host hold
- that base host hold is nested inside a hold form
- that base host hold form is nested inside a file
- that file is nested inside a deck (the @drumwork/base deck)
- that @drumwork/base deck is nested inside a host
- that @drumwork/base deck host is nested inside a host hold
- so base is a host form
- @drumwork/base file has the host form
- @drumwork/base file is nested inside the deck
- deck is nested inside the deck form
- deck is also inside the host
- the deck form is local to a specific host
- so host is a form, containing the deck form
  - no scratch that
- host is a mesh which has a deck form
- deck form is located in the deck form file
- the deck form file contains a deck form, which contains the specific deck
- the deck form file is contained in the drumwork host
- etc. it goes on and on.

So basically:

- base is a host form
- deck is a mesh
  - contained in a deck form
    - contained in a host
      - contained in a host form
        - contained in a host
          - contained in a host form
            - contained in a host
  - also contained in a host mesh

So the host contains the decks directly, but then also contains forms?

So the host is contained in a host form. The host form is the base, it doesn't go any higher than that.

- base is a host form
- file is a mesh
  - contained in a file form
  - also contained in a deck mesh

So for the most part:

- Every object is contained inside a form object.
- Every form object is
  - contained inside a file object.
  - but is also contained inside another form object (for forms)
- Every deck object is
  - contained inside a host
  - contained inside a deck form, relative to the host.

So now:

- host has deck form
  - host deck form has hold
    - host deck form hold has deck

```js
const deckForm = host.link.get('deck') // host.form(deck)
const deckFormHold = deckForm.hold('base')
const deck = deckFormHold.rack('text').get('mydeck')
const fileForm = deck.link.get('file') // deck.form(file)
const fileFormHold = fileForm.hold('base')
const file = fileFormHold.rack('text').get('example-file')
```

Then about the base.

```js
const baseForm = base.form('host')
const baseFormHold = baseForm.hold('base')
const host = baseFormHold.rack('text').get('my')
```

It's like a matrix. On one axis we have the host-deck-form-hold structure. On the other axis we have that same structure but for the host, deck, form, and hold objects.

The base is contained in a form, since it is a host form.

```js
const deck = deckFormHold.rack('text').get('base') // base == mydeck == drumwork/base
const baseFormFileForm = deck.link.get('file') // @drumwork/base/form
const baseFormFileFormHold = baseFormFileForm.get('base')
const baseFormFile = baseFormFileFormHold.rack('text').get('form') // name of file
const formForm = baseFormFile.link.get('form')
const formFormHold = formForm.link.get('base')
const base = formFormHold.rack('text').get('?')
```

So then how to store the base?

```js
formFormHold.rack('text').set('host', base) // repeat
base.link.set('host', baseForm)
baseForm.set('base', baseForm)
baseFormHold.rack('text').set('drumwork', host)
host.link.set('deck', deckForm)
deckForm.set('base', deckFormHold)
deckFormHold.rack('text').get('base', deck)
deck.link.set('file', baseFormFileForm)
baseFormFileForm.set('base', baseFormFileFormHold)
baseFormFileFormHold.rack('text').set('form', formFormHold)
baseFormFile.link.set('form', formFormHold)
formForm.link.set('base', formFormHold)
formFormHold.rack('text').set('host', base)
```

Not quite.

```js
hostForm.set('base', hostFormHold)
// baseFormHold
hostFormHold.rack('text').set('drumwork', host)
host.link.set('deck', deckForm)
deckForm.set('base', deckFormHold)
deckFormHold.rack('text').set('base', deck)
deck.link.set('file', file2Form)
file2Form.set('base', file2FormHold)
file2FormHold.rack('text').set('host', file2) // host is name of file
file2.link.set('host', hostForm) // === base, the host form
// baseForm
hostForm.set('base', hostFormHold)
// baseFormHold
hostFormHold.rack('text').set('drumwork', host)
host.link.set('deck', deckForm)
deckForm.set('base', deckFormHold)
deckFormHold.rack('text').set('base', deck)
deck.link.set('file', fileForm)
fileForm.set('base', fileFormHold)
fileFormHold.rack('text').set('form', file) // form is name of file
file.link.set('form', formFormHold)
formForm.link.set('base', formFormHold)
formFormHold.rack('text').set('host', base)
```

So then:

```js
const baseHold = new Hold({
  home: base, base, text: 'base', mark: baseHold.mark
})
base.set('base', baseHold)

const host = new Host({
  home: base, base, text: 'drumwork', mark: baseHostFuse.mark
})
baseHold.rack('text').set('drumwork', host)

const deckForm = new Form({
  home: base, base, text: 'deck', mark: baseDeckForm.mark
})
host.link.set('deck', deckForm)

const deckFormHold = new Hold({
  home: base, base, text: 'base', mark: baseDeckFormHold.mark
})
deckForm.set('base', deckFormHold)
```
