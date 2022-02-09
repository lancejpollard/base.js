
class Form extends Map {
  constructor({ mark, text }) {
    super()

    Object.defineProperty(this, 'link', { value: undefined, enumerable: false, writable: true })
    Object.defineProperty(this, 'file', { value: undefined, enumerable: false, writable: true })
    Object.defineProperty(this, 'form', { value: undefined, enumerable: false, writable: true })
    Object.defineProperty(this, 'term', { value: undefined, enumerable: false, writable: true })

    this.mark = mark
    this.text = text
  }

  /**
   * This creates a key/value index.
   */

  bind(term) {
    this.term = term
    this.link = new Map
  }

  save(mesh) {
    this.set(mesh.mark, mesh)

    if (this.term) {
      this.link.set(mesh.link[this.term], mesh)
    }
  }

  read({ mark, term }) {
    if (mark != null) {
      return this.get(mark)
    }

    if (term != null) {
      return this.link.get(term)
    }
  }
}

module.exports = Form
