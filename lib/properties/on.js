const { property, create } = require('../manipulate')
const { properties } = require('./')
// const { addKey } = require()

const on = {
  instances: false, // for ever false OPTION
  properties,
  child: {
    instances: false,
    properties,
    // need to do if !defintion && child === function ---> handle special this is not enough!
    child: (t, key, val, stamp) => {
      if (!t.listeners) {
        t.listeners = [ val ]
      } else {
        t.listeners.push(val)
      }
    }
  }
}

properties.on = (t, val, key, stamp) => property(t, key, val, stamp, on)
