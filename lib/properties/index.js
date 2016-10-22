const { get } = require('../get')
// add those defaults
const properties = {
  child: (target, val, key, stamp) => {
    // lets do child
  },
  instances: (target, val, key, stamp) => {
    // lets do child
    target.instances = val
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
    var properties = target.properties
    if (!properties) {
      const previous = get(target, 'properties', true)
      properties = target.properties = {}
      if (previous) {
        for (let key in previous) {
          properties[key] = previous[key]
        }
      }
    }
    for (let key in val) {
      // here well do similair behvaiours of course
      // big advantges of this system is that we can use delete
      properties[key] = val[key]
    }
    if (properties.propertiesMap) {
      delete properties.propertiesMap
    }
  }
}

exports.properties = properties
