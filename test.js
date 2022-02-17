
const Base = require('.')

const base = new Base()

base.file('@myorg/mydeck/example-file', file => {
  file.task('my-task', blob => {
    console.log(`message:`, blob)
  })
})

base.file('@myorg/mydeck/example-file-2', file => {
  file.knit('~one/~two')
  file.save('~one/~two/~three', 3)
  file.save('x', {
    a: {
      b: {
        c: {
          z: 10
        }
      }
    }
  })
})

base.file('@myorg/mydeck/example-file').call('my-task', base.file('@myorg/mydeck/example-file-2').read('x/a/b/c'))

console.log(base.file('@myorg/mydeck/example-file-2').read('~one/~two/~three'))
console.log(base.file('@myorg/mydeck/example-file-2').read('~one/~two/size'))
