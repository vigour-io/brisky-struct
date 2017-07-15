const test = require('tape')
const { struct } = require('../../')

test('context - perf - remove', t => {
  const cl = struct.create({
    instances: false,
    props: {
      default: 'self'
    }
  })
  const thing = cl.create()
  const payload = {}

  const val = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ' +
    'incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ' +
    'exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure ' +
    'dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'

  let i = 1e3
  while (i-- > 0) {
    const d = 1e11 + Math.round(Math.random() * 1e11)
    payload[`key-${d}-longer-string-${d}`] = {
      keyOne: { subKeyOne: val, subKeyTwo: val },
      keyTwo: { subKeyOne: val, subKeyTwo: val },
      keyThree: { subKeyOne: val, subKeyTwo: val },
      keyFour: { subKeyOne: val, subKeyTwo: val },
      keyFive: { subKeyOne: val, subKeyTwo: val }
    }
  }

  thing.set({ payload })

  var d = Date.now()
  thing.set(null)
  d = Date.now() - d

  t.ok(d < 300, 'removing context with props:self does not take longer then 300ms')

  t.end()
})
