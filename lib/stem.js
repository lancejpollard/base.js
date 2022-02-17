
const Knit = require('./knit')

class LineStem {
  constructor(mark, knit = false) {
    this.mark = mark
    this.knit = knit
  }
}

class Stem extends Knit {
  static list = (line) => {
    return line.split('/')
      .map(mark =>
        '~' === mark[0]
          ? new LineStem(mark.substr(1), true)
          : new LineStem(mark)
      )
  }

  static LineStem = LineStem

  constructor() {
    super()

    Object.defineProperty(this, 'bond', {
      value: undefined,
      enumerable: false,
      writable: true,
    })
  }

  knit(line) {
    const list = Stem.list(line)
    const n = list.length

    let i = 0
    let site = this

    while (i < n) {
      let stem = list[i]

      if (stem.knit) {
        let head = site.get(stem.mark)
        if (!head) {
          head = new Stem
          site.set(stem.mark, head)
        }
        site = head
      } else {
        throw new Error(`Line ${line} must each be a knit.`)
      }

      i++
    }

    return site
  }

  save(line, leaf) {
    const list = Stem.list(line)
    const n = list.length - 1

    let i = 0
    let site = this

    while (i < n) {
      let stem = list[i]

      if (stem.knit) {
        if (site instanceof Map) {
          site = site.get(stem.mark)
        } else {
          site = site[stem.mark]
        }
      } else {
        site = site[stem.mark]
      }

      if (!site) {
        throw new Error(`Line ${line} missing a point.`)
      }

      i++
    }

    let stem = list[i]

    if (stem.knit) {
      site.set(stem.mark, leaf)
    } else {
      site[stem.mark] = leaf
    }
  }

  read(line) {
    const list = Stem.list(line)
    const n = list.length

    let i = 0
    let site = this

    while (i < n) {
      let stem = list[i]

      if (stem.knit) {
        if (site instanceof Map) {
          site = site.get(stem.mark)
        } else {
          site = site[stem.mark]
        }
      } else {
        site = site[stem.mark]
      }

      if (!site) {
        return
      }

      i++
    }

    return site
  }
}

module.exports = Stem
