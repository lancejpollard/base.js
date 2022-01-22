
const Base = require('.')

const base = new Base()

const FORM = {
  host: 0,
  deck: 1,
  file: 2,
  form: 3,
}

const MARK = {
  FORM_HOST: FORM.host,
  FORM_DECK: FORM.deck,
  FORM_FILE: FORM.file,
  FORM_FORM: FORM.form,
  HOST_BASE: 0, // @drumwork
  DECK_BASE_HOST_BASE: 0, // @drumwork/base
  FILE_LINK_DECK_BASE_HOST_BASE: 0, // @drumwork/base/link
}

const MESH = [
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

console.log(base.bind('@myorg/mydeck/example-file-2').line())

function m(name) {
  if (!MARK.hasOwnProperty(name)) {
    throw new Error(`MARK ${name} undefined.`)
  }

  return MARK[name]
}
