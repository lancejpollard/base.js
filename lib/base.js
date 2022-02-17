
const Stem = require('./stem')
const File = require('./file')

class Base extends Stem {
  file(line, call) {
    return castFile({ base: this, line, call })
  }
}

module.exports = Base

function castFile({ base, line, call }) {
  const stem = base.knit(line.split('/').map(mark => `~${mark}`).join('/'))
  const file = stem.bond = stem.bond || new File()

  if (call) {
    call(file)
  }

  return file
}
