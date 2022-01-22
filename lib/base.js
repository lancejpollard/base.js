
const Mesh = require('./mesh')
const Host = require('./host')
const Deck = require('./deck')
const File = require('./file')
const Form = require('./form')

const HALT = {
  HOST_NOTE: `Base host '@drumwork' must be defined by this point.`,
  DECK_NOTE: `Base deck '@drumwork/base' must be defined by this point.`,
  FORM_FILE_NOTE: `Base deck file '@drumwork/base/form' must be defined by this point.`,
  FORM_FILE_HOLD_NOTE: `Base deck file '@drumwork/base/form => x' must be defined by this point.`,
  HOST_FILE_NOTE: `Base deck file '@drumwork/base/host' must be defined by this point.`,
  HOST_FILE_HOLD_NOTE: `Base deck file '@drumwork/base/host => x' must be defined by this point.`,
  FORM_BASE_NOTE: `Base form 'base' must be defined by this point.`,
  FORM_FORM_NOTE: `Base form 'form' must be defined by this point.`,
  FORM_HOST_NOTE: `Base form 'host' must be defined by this point.`,
  FORM_DECK_NOTE: `Base form 'deck' must be defined by this point.`,
  FORM_HOLD_NOTE: `Base form 'hold' must be defined by this point.`,
}

class Base extends Form {
  constructor() {
    super(0)

    Object.defineProperty(this, 'make', { value: true })
  }

  /**
   * Load in a schema to initialize the base structures.
   */

  fuse(list) {
    fuseBase({ base: this, list })
  }

  cast(road, call) {
    return castFile({ base: this, road, call })
  }

  free(road) {
    freeBase({ base: this, road })
  }

  save(tool) {

  }

  read(tool) {

  }

  test(tool) {

  }

  kick(tool) {

  }

  load(road) {
    return loadFile({ base: this, road })
  }

  /**
   * For importing a file in another file.
   */

  bind(road) {
    return bindFile({ base: this, road })
  }
}

module.exports = Base

function fuseBase({ base, list }) {
  if (base.make) {
    makeBase({ base, list })
    base.make = false
  }

  console.log('ready')
  const file = loadBaseDrumWorkFile({ base, list })

  // form
  const formForm = file.form('form')
  const formFormHold = formForm.hold('base')
  // get the index by the text value.
  const byFormTerm = formFormHold.rack('text')

  // if (list.host) {
  //   const hostForm = file.form('form')

  //   list.host.forEach(note => {
  //     // get the index by the term.
  //     const byFormTerm = hostForm.hold(0).list('term')
  //     const mesh = byFormTerm.get(note.name) ?? {}
  //     mesh.mark = note.mark
  //     mesh.name = note.name
  //     hostForm.hold(0).save(mesh)
  //   })
  // }
  for (const hostNote of list.host) {
    let host = base.link.get(hostNote.name)

    if (!host) {
      host = makeBaseHost({
        home: file.home,
        base,
        text: hostNote.name,
        mark: hostNote.mark
      })
      formFormHold.save(host)
    }

    for (const deckNote of hostNote.deck) {
      let deck = host.link.get(deckNote.name)

      if (!deck) {
        deck = makeBaseDeck({
          home: file.home,
          base: host,
          text: deckNote.name,
          mark: deckNote.mark
        })
        formFormHold.save(deck)
      }
    }
  }

  for (const note of list.form) {
    const mesh = byFormTerm.get(note.name)
    if (!mesh) {
      formFormHold.save(new Mesh({
        home: file.home,
        base: formFormHold,
        text: note.name,
        mark: note.mark
      }))
    }
  }
}

function castFile({ base, road, call }) {
  const file = base.load(road)
  call(file)
  return file
}

function freeBase({ base, road }) {
  const { hostName, deckName, filePath } = getParts(road)

  const host = base.link.get(hostName)

  if (!host) {
    return
  }

  const deck = host.link.get(deckName)

  if (!deck) {
    return
  }

  const file = deck.link.get(filePath)

  if (!file) {
    return
  }

  deck.delete(file.mark)
  deck.link.delete(file.hint)

  if (deck.size) {
    return
  }

  host.delete(deck.mark)
  host.link.delete(deck.hint)

  if (host.size) {
    return
  }

  base.delete(host.mark)
  base.link.delete(host.hint)
}

function loadFile({ base, road }) {
  const { hostName, deckName, filePath } = getParts(road)

  const host = base.link.get(hostName)

  if (!host) {
    throw new Error(`Host @${hostName} must be defined with base.fuse`)
  }

  const deck = host.link.get(deckName)

  if (!deck) {
    throw new Error(`Deck @${hostName}/${deckName} must be defined with base.fuse`)
  }

  const file = deck.link.get(filePath)

  if (!file) {
    throw new Error(`File @${hostName}/${fileName}/${filePath} must be defined with base.fuse`)
  }

  return file
}

function bindFile({ base, road }) {
  const { hostName, deckName, filePath } = getParts(road)

  const host = base.link.get(hostName)

  if (!host) {
    throw new Error(`Host ${hostName} is undefined from base.bind('${road}')`)
  }

  const deck = host.link.get(deckName)

  if (!deck) {
    throw new Error(`Deck ${deckName} is undefined from base.bind('${road}')`)
  }

  const file = deck.link.get(filePath)

  if (!file) {
    throw new Error(`File ${filePath} is undefined from base.bind('${road}')`)
  }

  return file
}

function findNote({ list, name, halt, hint = 'name' }) {
  const note = list?.find(note => note[hint] === name)

  if (!note || note.mark === null) {
    throw new Error(halt)
  }

  return note
}

function findEachBaseNote({ base, list }) {
  const hostNote = findNote({
    list: list.host,
    name: 'drumwork',
    halt: HALT.HOST_NOTE
  })

  const deckNote = findNote({
    list: hostNote.deck,
    name: 'base',
    halt: HALT.DECK_NOTE
  })

  const formFileNote = findNote({
    list: deckNote.file,
    name: 'form',
    halt: HALT.FORM_FILE_NOTE,
    hint: 'road',
  })

  const formFileHoldNote = findNote({
    list: formFileNote.hold,
    name: 'base',
    halt: HALT.FORM_FILE_HOLD_NOTE
  })

  const hostFileNote = findNote({
    list: deckNote.file,
    name: 'host',
    halt: HALT.HOST_FILE_NOTE,
    hint: 'road',
  })

  const hostFileHoldNote = findNote({
    list: hostFileNote.hold,
    name: 'base',
    halt: HALT.HOST_FILE_HOLD_NOTE
  })

  const formBaseNote = findNote({
    list: list.form,
    name: 'base',
    halt: HALT.FORM_BASE_NOTE
  })

  const formFormNote = findNote({
    list: list.form,
    name: 'form',
    halt: HALT.FORM_FORM_NOTE
  })

  const hostFormNote = findNote({
    list: list.form,
    name: 'host',
    halt: HALT.FORM_HOST_NOTE
  })

  const deckFormNote = findNote({
    list: list.form,
    name: 'deck',
    halt: HALT.FORM_DECK_NOTE
  })

  const holdFormNote = findNote({
    list: list.form,
    name: 'hold',
    halt: HALT.FORM_HOLD_NOTE
  })

  return {
    hostNote,
    deckNote,
    formFileNote,
    formFileHoldNote,
    hostFileNote,
    hostFileHoldNote,
    formBaseNote,
    formFormNote,
    hostFormNote,
    deckFormNote,
    holdFormNote,
  }
}

function makeBase({ base, list }) {
  const {
    hostNote,
    deckNote,
    formFileNote,
    formFileHoldNote,
    hostFileNote,
    hostFileHoldNote,
    formBaseNote,
    formFormNote,
    hostFormNote,
    deckFormNote,
    holdFormNote,
  } = findEachBaseNote({ base, list })

  // const baseHold = new Hold({
  //   home: base,
  //   base,
  //   text: 'base',
  //   mark: baseHold.mark
  // })
  // base.set('base', baseHold)

  // const host = new Host({
  //   home: base, base, text: 'drumwork', mark: baseHostFuse.mark
  // })
  // baseHold.rack('text').set('drumwork', host)

  // const deckForm = new Form({
  //   home: base, base, text: 'deck', mark: baseDeckForm.mark
  // })
  // host.link.set('deck', deckForm)

  // const deckFormHold = new Hold({
  //   home: base, base, text: 'base', mark: baseDeckFormHold.mark
  // })
  // deckForm.set('base', deckFormHold)

  // const host = base.link.get(hostName)
  //   ?? makeBaseHost({
  //     home: base,
  //     base,
  //     text: hostName,
  //     mark: baseHostNote.mark
  //   })

  // const deck = findMesh({ base: host, text: deckName })
  //   ?? makeBaseDeck({
  //     home: base,
  //     host: host,
  //     text: deckName,
  //     mark: baseDeckNote.mark
  //   })

  // const file = findMesh({ base: deck, text: filePath })
  //   ?? makeBaseFile({
  //     home: base,
  //     base: deck,
  //     text: filePath,
  //     mark: baseFileNote.mark
  //   })

  // const hold = findMesh({ base: deck, text: 'base' })
  //   ?? makeBaseFile({
  //     home: base,
  //     base: deck,
  //     text: 'base',
  //     mark: baseHoldNote.mark
  //   })


  // const formForm = findMesh({ base: file, text: 'form' })
  //   ?? makeBaseForm({
  //     home: base,
  //     base: file,
  //     text: 'form',
  //     mark: formFormNote.mark
  //   })

  // const hostForm = findMesh({ base: file, text: 'host' })
  //   ?? makeBaseForm({
  //     home: base,
  //     base: file,
  //     text: 'host',
  //     mark: hostFormNote.mark
  //   })

  // // now that we have the file, we can
  // // add the host and deck to it.
  // file.link.set('host', hostForm)
  // file.set(hostForm.mark, hostForm)

  // file.link.set('form', formForm)
  // file.set(formForm.mark, formForm)

  // // form collection
  // formForm.link.set('host', hostForm)
  // formForm.set(hostForm.mark, hostForm)
  // formForm.link.set('form', formForm)
  // formForm.set(formForm.mark, formForm)

  // // easy access
  // hostForm.link.set(hostName, host)
  // hostForm.set(host.mark, host)

  // return file
}

function findFile({ base, hostName, deckName, filePath }) {
  const host = base
    .get('base')
    ?.link.get('text')
    ?.get(hostName)

  if (!host) {
    return
  }

  const deck = host
    .link.get('deck')
    ?.get('base')
    ?.link.get('text')
    ?.get(deckName)

  if (!deck) {
    return
  }

  const file = deck
    .link.get('file')
    ?.get('base')
    ?.link.get('text')
    ?.get(filePath)

  return file
}

function findMesh({ base, text }) {
  return base.link.get(text)
}

/**
 * By this point, it still doesn't have a file.
 *
 * So it is in an intermediate state.
 */

function makeBaseHost({ home, base, text, mark }) {
  const head = new Host({ mark, base, text, home })
  base.set(mark, head)
  base.link.set(text, head)

  return head
}

function makeBaseDeck({ home, host, text, mark }) {
  const head = new Deck({ mark, base: host, text, home })
  host.set(mark, head)
  host.link.set(text, head)

  return head
}

/**
 * By this point, we have created the first file.
 *
 * Once we have the first file,
 * we can go back through the just-created
 * host and deck records and add them to files.
 */

function makeBaseFile({ home, base, text, mark }) {
  const file = new File({ home, base, text, mark })
  base.set(mark, file)
  base.link.set(text, file)

  return file
}

function makeBaseForm({ home, base, text, mark }) {
  const form = new Form({ home, base, text, mark })
  base.set(mark, form)
  base.link.set(text, form)

  return form
}

function getParts(road) {
  const [hostName, deckName, ...list] = road.split('/')
  const filePath = list.join('/')
  return {
    hostName: hostName.substr(1), // remove @ at beginning
    deckName,
    filePath
  }
}
