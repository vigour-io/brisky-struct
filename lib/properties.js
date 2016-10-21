const { get } = require('./get')

const getDefinition = (target, key) => {
  const properties = get(target, 'properties', true)
  return properties && properties[key]
}

const properties = {
  child: (target, val, key, stamp) => {
    // lets do child
  },
  types: () => {
    // some types
  },
  $transform: (target, val) => {
    // can add more like keys -- do this later
    target.$transform = val
    // changed?
  },
  properties: (target, val, key, stamp) => {
    // need to update instances
    if (!target.properties) {
      const previous = get(target, 'properties', true)
      target.properties = {}
      if (previous) {
        for (let key in previous) {
          target.properties[key] = previous[key]
        }
      }
    }
    for (let key in val) {
      // here well do similair behvaiours of course
      // big advantges of this system is that we can use delete
      target.properties[key] = val[key]
    }
  }
}

exports.getDefinition = getDefinition
exports.properties = properties
