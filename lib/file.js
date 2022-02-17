
const Stem = require('./stem')

class File extends Stem {
  constructor() {
    super()

    this.bond = { task: new Stem }
  }

  task(name, call) {
    if (call) {
      this.bond.task.set(name, call)
    } else {
      const task = this.bond.task.get(name)
      if (!task) {
        throw new Error(`Task ${name} undefined`)
      }
      return task
    }
  }

  call(name, ...bind) {
    const task = this.task(name)
    return task(...bind)
  }
}

module.exports = File
