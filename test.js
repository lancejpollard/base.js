
const Base = require('.')

const base = new Base()

base.fuse({
  form: [
    {
      name: 'base',
      mark: 0
    },
    {
      name: 'form',
      mark: 1
    },
    {
      name: 'host',
      mark: 2
    },
    {
      name: 'deck',
      mark: 3
    },
    {
      name: 'hold',
      mark: 4
    },
  ],
  host: [
    {
      name: 'drumwork',
      mark: 0,
      deck: [
        {
          name: 'base',
          mark: 0,
          file: [
            {
              road: 'form',
              mark: 0,
              hold: [
                {
                  name: 'base',
                  mark: 0,
                }
              ]
            },
            {
              road: 'host',
              mark: 1,
              hold: [
                {
                  name: 'base',
                  mark: 0,
                }
              ]
            }
          ]
        }
      ]
    }
  ]
})

base.cast('@myorg/mydeck/example-file', file => {
  file.set('my-task', text => {
    console.log(`message: ${text}`)
  })
})

base.cast('@myorg/mydeck/example-file-2', file => {
  file.set('my-task', text => {
    console.log(`message: ${text}`)
  })
})

base.bind('@myorg/mydeck/example-file').call('my-task', 'foo')

console.log(base.bind('@myorg/mydeck/example-file-2').line())
