const { property, create } = require('../manipulate')
const { properties } = require('./')
const { addKey } = require('../keys')

const on = {
  instances: false,
  properties,
  child: {
    instances: false,
    properties,
    child: (t, key, val, stamp) => {
      addKey(t, key)
      t[key] = val
    }
  }
}

properties.on = (t, val, key, stamp) => property(t, key, val, stamp, on)
