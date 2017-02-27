import { get } from '../get'
import { getKeys } from '../keys'

const mapper = (t) => (getKeys(t) || []).map(key => get(t, key))

export default {
  map (fn, callee) {
    return (getKeys(this) || []).map((val, key, array) => fn(get(this, val), key, array))
  },
  reduce (fn, start) {
    return mapper(this).reduce(fn, start)
  },
  filter (fn) {
    return mapper(this).filter(fn)
  },
  slice (start, end) {
    return mapper(this).slice(start, end)
  },
  sort (fn) {
    return mapper(this).sort(fn)
  },
  reverse (fn) {
    return mapper(this).reverse(fn)
  },
  find (val) {
    const keys = getKeys(this)
    if (keys) {
      for (let i = 0, len = keys.length; i < len; i++) {
        const r = get(this, keys[i])
        if (val(r, i, this)) return r
      }
    }
  },
  some (val) {
    const keys = getKeys(this)
    if (keys) {
      for (let i = 0, len = keys.length; i < len; i++) {
        const r = get(this, keys[i])
        if (val(r, i, this)) return true
      }
    }
    return false
  },
  every (val) {
    const keys = getKeys(this)
    if (keys) {
      for (let i = 0, len = keys.length; i < len; i++) {
        if (!val(get(this, keys[i]), i, this)) return false
      }
    }
    return true
  },
  findIndex (val) {
    const keys = getKeys(this)
    if (keys) {
      for (let i = 0, len = keys.length; i < len; i++) {
        if (val(get(this, keys[i]), i, this)) return i
      }
    }
    return -1
  },
  indexOf (val) {
    const keys = getKeys(this)
    if (keys) {
      for (let i = 0, len = keys.length; i < len; i++) {
        const r = get(this, keys[i])
        if (r.compute() === val || r === val) return i
      }
    }
    return -1
  },
  lastIndexOf (val) {
    const keys = getKeys(this)
    if (keys) {
      let i = keys.length
      while (i--) {
        const r = get(this, keys[i])
        if (r.compute() === val || r === val) return i
      }
    }
    return -1
  },
  includes (val, index = 0) {
    const keys = getKeys(this)
    if (keys) {
      for (let len = keys.length, i = index > -1 ? index : Math.max(len + index, 0); i < len; i++) {
        const r = get(this, keys[i])
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
        const key = keys[i]
        const r = get(this, key)
        if (r) { fn(r, key, this) }
      }
    }
  }
}
