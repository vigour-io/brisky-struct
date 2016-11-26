const test = require('tape')
const struct = require('../../')

test('context - props', t => {
  const app = struct({
    types: {
      hello: {
        props: {
          default: {
            text: 'hello'
          }
        }
      },
      bye: {
        x: {
          type: 'hello'
        }
      }
    },
    bla: {
      type: 'hello',
      field: true
    },
    blur: { type: 'hello' },
    bah: {
      type: 'hello', // if you change this to bye its wrong
      props: {
        default: {
          text: 'yo yo yo'
        }
      }
    },
    bur: {
      // also need to resolve the top when in context
      type: 'bye', // if you change this to bye its wrong
      props: {
        default: {
          text: 'yo yo yo'
        }
      }
    }
    // over types goes wrong as well the bye case
  })

  // console.log(app.bla.get('props').default)

  console.log(app.get([ 'bla', 'field', 'text', 'compute' ]))

  console.log(app.get([ 'bla', 'props' ]).default.struct.text.val)

  console.log(app.get([ 'bah', 'props' ]).default.struct.text.val)

  t.end()
})
