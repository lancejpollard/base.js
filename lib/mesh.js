
const MARK = 'x__mark__x'

/**
 * Record which can be potentially bound to.
 */

class Mesh extends Map {
  constructor({ home, base, text, mark }) {
    super()

    Object.defineProperty(this, 'base', { value: base, enumerable: false })
    Object.defineProperty(this, 'view', { value: new Map, enumerable: false })
    Object.defineProperty(this, 'text', { value: text, enumerable: false })
    Object.defineProperty(this, 'foot', { value: !base, enumerable: false })
    Object.defineProperty(this, 'home', { value: home, enumerable: false })
    Object.defineProperty(this, 'bindHead', { value: 1n, enumerable: false })
    Object.defineProperty(this, 'link', { value: new Map, enumerable: false })

    this.mark = mark
  }

  /**
   * Get the line back to the base.
   */

  line() {
    const list = []
    let mesh = this
    while (mesh && !mesh.foot) {
      list.push(mesh.mark)
      mesh = mesh.base
    }
    return list
  }

  save(link = {}) {
    link = new Map(link)

    const diff = makeDiff(this.link, link)

    for (const [name, blob] of link) {
      this.link.set(name, blob)
    }

    note(this, diff)
  }

  call(name, ...bind) {
    return this.link[name].call(null, ...bind)
  }

  /**
   * Watch for changes.
   */

  bind(call) {
    if (!call.hasOwnProperty(MARK)) {
      Object.defineProperty(call, MARK, {
        value: this.bindHead++,
        enumerable: false
      })
    }

    this.view.set(call[MARK], call)
  }

  free(call) {
    this.view.delete(call[MARK])
  }
}

module.exports = Mesh

function makeDiff(a, b) {
  const diff = new Map

  for (const [nameB, blobB] of b) {
    const blobA = a.get(nameB)
    if (blobA !== blobB) {
      diff.set(nameB, blobA)
    }
  }

  return diff
}

function note(mesh, diff) {
  if (!diff.size) {
    return
  }

  if (!mesh.view.size) {
    return
  }

  for (const call of mesh.view.values()) {
    call(diff, mesh)
  }
}
