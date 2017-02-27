import { get } from '../get'
import { getKeys } from '../keys'
// add every, find, sort, slice

export default {
  reduce (fn, start) {
    return (getKeys(this) || []).map(key => get(this, key)).reduce(fn, start)
  },
  map (fn, callee) {
    return (getKeys(this) || []).map((val, key, array) => fn(get(this, val), key, array))
  },
  filter (fn) {
    return (getKeys(this) || []).map(key => get(this, key)).filter(fn)
  },
  find (val) {
    var keys = getKeys(this)
    if (keys) {
      for (let i = 0, len = keys.length; i < len; i++) {
        let r = get(this, keys[i])
        if (val(r, i, this)) return r
      }
    }
  },
  includes (val, index = 0) {
    var keys = getKeys(this)
    if (keys) {
      for (let len = keys.length, i = index > -1 ? index : Math.max(len + index, 0); i < len; i++) {
        let r = get(this, keys[i])
        if (r.compute() === val || r === val) return true
      }
    }
    return false
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
