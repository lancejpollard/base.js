
const Mesh = require('./mesh')
const Rack = require('./rack')

class Hold extends Mesh {
  read(query) {
    // check the list index closest to the query
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

module.exports = Hold
