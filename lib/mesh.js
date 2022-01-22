
const MARK = 'x__mark__x'

/**
 * Record which can be potentially bound to.
 */

class Mesh extends Map {
  constructor({ home, file, form, text, mark }) {
    super()

    Object.defineProperty(this, 'file', { value: file, enumerable: false, writable: true })
    Object.defineProperty(this, 'form', { value: form, enumerable: false, writable: true })
    Object.defineProperty(this, 'view', { value: new Map, enumerable: false, writable: true })
    Object.defineProperty(this, 'text', { value: text, enumerable: false, writable: true })
    Object.defineProperty(this, 'home', { value: home, enumerable: false, writable: true })
    Object.defineProperty(this, 'bindHead', { value: 1n, enumerable: false, writable: true })
    Object.defineProperty(this, 'link', { value: new Map, enumerable: false, writable: true })

    this.mark = mark
  }

  /**
   * Get the line back to the base.
   */

  line() {
    const { file, form } = this
    const { deck } = file
    const { host } = deck
    return [
      host.mark,
      deck.mark,
      file.mark,
      form.mark,
      this.mark
    ]
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
