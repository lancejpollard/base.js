
const Base = require('.')

const base = new Base()

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

const MARK = {
  ...MARK_BASE,
  HOST_MY_ORG: 1,
  DECK_MY_DECK_HOST_MY_ORG: 0,
  FILE_LINK_DECK_MY_DECK_HOST_MY_ORG: 0,
  FILE_EXAMPLE_DECK_MY_DECK_HOST_MY_ORG: 1,
  FILE_EXAMPLE_2_DECK_MY_DECK_HOST_MY_ORG: 2
}

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

base.fuse({
  host: m('HOST_BASE'),
  deck: m('DECK_BASE_HOST_BASE'),
  file: m('FILE_LINK_DECK_BASE_HOST_BASE'),
  form: FORM,
  mesh: MESH,
})

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

base.bind('@myorg/mydeck/example-file').call('my-task', 'foo')

console.log(base.read(...base.bind('@myorg/mydeck/example-file-2').line()).text)

function m(name) {
  if (!MARK.hasOwnProperty(name)) {
    throw new Error(`MARK ${name} undefined.`)
  }

  return MARK[name]
}
