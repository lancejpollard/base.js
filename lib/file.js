
const Mesh = require('./mesh')
const Form = require('./form')

class File extends Mesh {
  bind(task) {
    this.host = task
  }

  form(name) {
    let form = this.home.bind('@drumwork/base/note').link.get('form')

    if (!form) {
      throw new Error(`Form ${name} is undefined`)
    }

    return form
  }

  /**
   * Call a task/function defined on this object.
   */

   call(name, ...bind) {
    return this.get(name).call(null, ...bind)
  }
}

module.exports = File
