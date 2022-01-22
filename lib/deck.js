
const Mesh = require('./mesh')

class Deck extends Mesh {
  constructor({ home, host, file, form, text, mark }) {
    super({ home, file, form, text, mark })

    Object.defineProperty(this, 'host', { value: host, enumerable: false, writable: true })
  }
}

module.exports = Deck
