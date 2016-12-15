const test = require('tape')
const struct = require('../../').create

test('context - props', t => {
  const app = struct({
    types: {
      text: 'hello',
      hello: {
        props: {
          default: {
            text: { type: 'text' }
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

  t.equal(app.get([ 'bla', 'field', 'text', 'compute' ]), 'hello')
  t.equal(app.get([ 'bla', 'props' ]).default.struct.text.get('val'), 'hello')
  t.equal(app.get([ 'bah', 'props' ]).default.struct.text.val, 'yo yo yo')

  console.log()

  t.end()
})
