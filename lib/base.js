
const Host = require('./host')
const Deck = require('./deck')
const File = require('./file')
const Form = require('./form')

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

class Base extends Map {
  constructor() {
    super()

    Object.defineProperty(this, 'formListHead', { value: {}, enumerable: false })
    Object.defineProperty(this, 'formListTail', { value: {}, enumerable: false })
    // the base host/deck/file is where you find all the forms.
    Object.defineProperty(this, 'baseHost', { value: null, enumerable: false, writable: true })
    Object.defineProperty(this, 'baseDeck', { value: null, enumerable: false, writable: true })
    Object.defineProperty(this, 'baseFile', { value: null, enumerable: false, writable: true })
    // the tree to find host/deck/file/form objects quickky.
    Object.defineProperty(this, 'tree', { value: {}, enumerable: false })

    Object.defineProperty(this, 'link', { value: new Map, enumerable: false })
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
    if (host != null) {
      this.baseHost = host
    }

    if (deck != null) {
      this.baseDeck = deck
    }

    if (file != null) {
      this.baseFile = file
    }

    Object.keys(form).forEach(name => {
      this.formListHead[name] = form[name]
      this.formListTail[form[name]] = name
    })

    saveMeshList({
      base: this,
      meshList: mesh
    })
  }

  file(road, call) {
    return castFile({ base: this, road, call })
  }

  free(road) {
    freeBase({ base: this, road })
  }

  save(tool) {

  }

  read(...list) {
    if (list.length > 1) {
      const [
        hostMark,
        deckMark,
        fileMark,
        formMark,
        meshMark,
      ] = list

      const host = this.get(hostMark)

      if (!host) {
        return
      }

      const deck = host.get(deckMark)

      if (!deck) {
        return
      }

      const file = deck.get(fileMark)

      if (!file) {
        return
      }

      const form = file.get(formMark)

      if (!form) {
        return
      }

      const mesh = form.get(meshMark)

      return mesh
    }
  }

  test(tool) {

  }

  kick(tool) {

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
  const file = loadFile({ base, road })
  if (call) {
    call(file)
  }
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
    throw new Error(`File @${hostName}/${deckName}/${filePath} must be defined with base.fuse`)
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

function saveMeshList({
  base,
  meshList,
}) {
  saveEachMesh({
    base,
    meshList,
  })

  bindEachMesh({
    base,
    meshList,
  })
}

/**
 * Now that we have all the main records created,
 * associate them properly.
 */

function bindEachMesh({
  base,
  meshList,
}) {
  for (const mesh of meshList) {
    bindMesh({
      mesh,
      base,
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
}) {
  const tool = base.tree[mesh.host][mesh.deck][mesh.file][mesh.form][mesh.mark]
  const file = base.tree[mesh.host][mesh.deck][mesh.file][base.formListHead.file][mesh.file]
  const form = base.tree[base.baseHost][base.baseDeck][base.baseFile][base.formListHead.form][mesh.form]

  tool.file = file
  tool.form = form

  form.set(tool.mark, tool)

  file.set(form.mark, form)
  file.link.set(form.text, form)

  const formName = base.formListTail[mesh.form]

  switch (formName) {
    case 'file':
      const deck = base.tree[mesh.host][mesh.deck][mesh.file][base.formListHead.deck][mesh.deck]
      tool.deck = deck

      deck.set(tool.mark, tool)
      deck.link.set(tool.text, tool)
      break
    case 'deck':
      const host = base.tree[mesh.host][mesh.deck][mesh.file][base.formListHead.host][mesh.host]
      tool.host = host

      host.set(tool.mark, tool)
      host.link.set(tool.text, tool)
      break
    case 'host':
      base.set(tool.mark, tool)
      base.link.set(tool.text, tool)
      break
  }
}

function saveEachMesh({
  base,
  meshList
}) {
  for (const mesh of meshList) {
    saveMesh({
      base,
      mesh,
    })
  }
}

function saveMesh({
  base,
  mesh,
}) {
  for (const name of MESH_BASE_LIST) {
    if (!mesh.hasOwnProperty(name) || mesh[name] == null) {
      throw new Error(`Mesh missing '${name}' attribute ${JSON.stringify(mesh)}.`)
    }
  }

  const formName = base.formListTail[mesh.form]

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

  saveToolToTree({
    base,
    mesh,
    tool,
  })
}

function saveToolToTree({ base, mesh, tool }) {
  const hostList = base.tree[mesh.host] = base.tree[mesh.host] ?? {}
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
