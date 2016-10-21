const { get } = require('./get')

const removeKey = (target, key) => {
  for (let i = 0; i < target.keys.length; i++) {
    if (target.keys[i] === key) {
      target.keys.splice(i, 1)
      break
    }
  }
  // UPDATE KEY INSTANCES
}

const createKeys = (target) => {
  const keys = get(target.inherits, 'keys', true)
  target.keys = keys ? keys.concat([]) : []
}

const addKey = (target, key) => {
  if (!target.keys) { createKeys(target) }
  target.keys.push(key)
  // UPDATE KEY INSTANCES
}

exports.removeKey = removeKey
exports.addKey = addKey
exports.createKeys = createKeys
