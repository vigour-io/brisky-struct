import { get } from './get'
import { getKeys } from './keys'

export default {
  reduce (fn, start) {
    return getKeys(this).map(key => get(this, key)).reduce(fn, start)
  },
  map (fn, callee) {
    return getKeys(this).map((val, key, array) => fn(get(this, val), key, array))
  },
  filter (fn) {
    // later add sort and cached array methods
    // also think about syncing sort
    // syncing props
    return getKeys(this).map(key => get(this, key)).filter(fn)
  },
  forEach (fn) {
    const keys = getKeys(this)
    for (let i = 0, len = keys.length; i < len; i++) {
      let key = keys[i]
      fn(get(this, key), key, this)
    }
  }
}
