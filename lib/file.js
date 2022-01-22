
const Mesh = require('./mesh')
const Form = require('./form')

class File extends Mesh {
  constructor({ home, deck, file, form, text, mark }) {
    super({ home, file, form, text, mark })

    Object.defineProperty(this, 'deck', { value: deck, enumerable: false, writable: true })
  }

  form(name) {
    let formMark = this.home.formList[name]

    if (!formMark) {
      throw new Error(`Form ${name} undefined.`)
    }

    const form = this.get(formMark) ?? makeForm({
      file: this,
      mark: formMark,
      name,
    })

    return form
  }

  task(name, call) {

  }

  /**
   * Call a task/function defined on this object.
   */

   call(name, ...bind) {
    return this.get(name).call(null, ...bind)
  }
}

module.exports = File

function makeForm({ file, mark, name }) {
  const form = new Form({ mark, text: name })
  file.set(mark, form)
  file.link.set(name, form)
  return form
}
