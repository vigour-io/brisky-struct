const { get } = require('../get')
const { getKeys } = require('../keys')
// add every, find, sort, slice

exports.define = {
  reduce (fn, start) {
    return (getKeys(this) || []).map(key => get(this, key)).reduce(fn, start)
  },
  map (fn, callee) {
    return (getKeys(this) || []).map((val, key, array) => fn(get(this, val), key, array))
  },
  filter (fn) {
    return (getKeys(this) || []).map(key => get(this, key)).filter(fn)
  },
  forEach (fn) {
    var keys = getKeys(this)
    if (keys) {
      keys = keys.concat()  // bit slow but usefull for remove for example
      for (let i = 0, len = keys.length; i < len; i++) {
        let key = keys[i]
        let r = get(this, key)
        if (r) { fn(r, key, this) }
      }
    }
  }
}
