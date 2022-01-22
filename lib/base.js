
const Mesh = require('./mesh')
const Host = require('./host')
const Deck = require('./deck')
const File = require('./file')
const Form = require('./form')
const Hold = require('./hold')

const FORM = {
  host: Host,
  deck: Deck,
  file: File,
  form: Form,
}

const MESH_BASE_LIST = [
  'host',
  'deck',
  'file',
  'form',
  'mark',
]

class Base extends Form {
  constructor() {
    super(0)

    Object.defineProperty(this, 'formList', { value: {}, enumerable: false })
  }

  /**
   * Map IDs properly so we reference the global system.
   */

  fuse({
    host,
    deck,
    file,
    form,
    mesh
  }) {
    if (host) {
      this.baseHost = host
    }

    if (deck) {
      this.baseDeck = deck
    }

    if (file) {
      this.baseFile = file
    }

    for (const name of form) {
      this.formList[name] = form[name]
    }

    saveMeshList({
      base: this,
      baseHost: this.baseHost,
      baseDeck: this.baseDeck,
      baseFile: this.baseFile,
      formListHead: form,
      meshList: mesh
    })
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

function castFile({ base, road, call }) {
  const file = base.load(road)
  call(file)
  return file
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

function saveMeshList({
  base,
  baseHost,
  baseDeck,
  baseFile,
  formListHead,
  meshList,
}) {
  const formListTail = Object
    .keys(formListHead)
    .reduce((m, x) => {
      m[formListHead[x]] = x
      return m
    }, {})

  const list = {}

  saveEachMesh({
    base,
    list,
    formListHead,
    formListTail,
    meshList,
  })

  bindEachMesh({
    base,
    list,
    baseHost,
    baseDeck,
    baseFile,
    formListHead,
    formListTail,
    meshList,
  })
}

/**
 * Now that we have all the main records created,
 * associate them properly.
 */

function bindEachMesh({
  base,
  list,
  baseHost,
  baseDeck,
  baseFile,
  formListHead,
  formListTail,
  meshList,
}) {
  for (const mesh of meshList) {
    bindMesh({
      mesh,
      base,
      list,
      baseHost,
      baseDeck,
      baseFile,
      formListHead,
      formListTail,
    })
  }

  // for (const mesh of meshList) {
  //   const tool = list[mesh.host][mesh.deck][mesh.file][mesh.form][mesh.mark]
  //   console.log(tool.line())
  // }
}

function bindMesh({
  mesh,
  base,
  list,
  baseHost,
  baseDeck,
  baseFile,
  formListHead,
  formListTail,
}) {
  const tool = list[mesh.host][mesh.deck][mesh.file][mesh.form][mesh.mark]
  const file = list[mesh.host][mesh.deck][mesh.file][formListHead.file][mesh.file]
  const form = list[baseHost][baseDeck][baseFile][formListHead.form][mesh.form]
  tool.file = file
  tool.form = form

  const formName = formListTail[mesh.form]

  switch (formName) {
    case 'file':
      const deck = list[mesh.host][mesh.deck][mesh.file][formListHead.deck][mesh.deck]
      tool.deck = deck
      break
    case 'deck':
      const host = list[mesh.host][mesh.deck][mesh.file][formListHead.host][mesh.host]
      tool.host = host
      break
  }
}

function saveEachMesh({
  base,
  list,
  formListHead,
  formListTail,
  meshList
}) {
  for (const mesh of meshList) {
    saveMesh({
      base,
      mesh,
      formListHead,
      formListTail,
      list
    })
  }
}

function saveMesh({
  base,
  mesh,
  formListHead,
  formListTail,
  list, // database of created records for easy getting.
}) {
  for (const name of MESH_BASE_LIST) {
    if (!mesh.hasOwnProperty(name) || mesh[name] == null) {
      throw new Error(`Mesh missing '${name}' attribute ${JSON.stringify(mesh)}.`)
    }
  }

  const formName = formListTail[mesh.form]

  if (!formName) {
    throw new Error(`No form name found for ${JSON.stringify(mesh)}.`)
  }

  const Form = FORM[formName]

  if (!Form) {
    throw new Error(`No form found for ${formName}.`)
  }

  const tool = new Form({
    home: base,
    // can't set the base yet until all mesh records are created.
    mark: mesh.mark,
    text: mesh.text,
  })

  saveToolToList({
    list,
    mesh,
    tool,
  })
}

function saveToolToList({ list, mesh, tool }) {
  const hostList = list[mesh.host] = list[mesh.host] ?? {}
  const deckList = hostList[mesh.deck] = hostList[mesh.deck] ?? {}
  const fileList = deckList[mesh.file] = deckList[mesh.file] ?? {}
  const formList = fileList[mesh.form] = fileList[mesh.form] ?? {}

  formList[mesh.mark] = tool
}

function saveFormList({ base, list }) {

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
