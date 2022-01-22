
class Form extends Map {
  constructor({ mark, text }) {
    super()

    Object.defineProperty(this, 'link', { value: new Map, enumerable: false })
    Object.defineProperty(this, 'file', { value: undefined, enumerable: false, writable: true })
    Object.defineProperty(this, 'form', { value: undefined, enumerable: false, writable: true })

    this.mark = mark
    this.text = text
  }

  /**
   * This creates a key/value index.
   */

   rack(term) {
    let rack = this.link.get(term)

    if (!rack) {
      rack = new Rack()
      this.link.set(term, rack)
    }

    return rack
  }

  save(mesh) {
    // save into index
    const textRack = this.rack('text')
    textRack.set(mesh.text, mesh)

    // save into list
    this.set(mesh.mark, mesh)
  }
}

module.exports = Form
