
const Hold = require('./hold')
const Mesh = require('./mesh')

class Form extends Mesh {
  hold(mark) {
    return this.get(mark)
      ?? makeHold({ form: this, mark })
  }
}

module.exports = Form

function makeHold({ form, mark }) {
  const hold = new Hold({ home: form.home, base: form, mark })
  form.set(mark, hold)

  return hold
}
