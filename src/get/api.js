import { get, getOrigin } from './'
import { set } from '../manipulate'

export default (t, key, val, stamp) => {
  console.log('????')
  var bind
  if (typeof key === 'object') {
    if (val !== void 0) {
      for (let i = 0, len = key.length; t && i < len; i++) {
        bind = t
        t = getOrigin(t, key[i])
        if (!t) {
          let ret = set(bind, { [key[i]]: i === len - 1 ? val : {} }, stamp)
          if (ret && ret.inherits) { bind = ret }
          t = get(bind, key[i])
        }
        if (typeof t === 'function') { t = bind[key[i]]() }
      }
    } else {
      for (let i = 0, len = key.length; t && i < len; i++) {
        bind = t
        t = get(t, key[i]) || getOrigin(t, key[i])
        if (typeof t === 'function') { t = bind[key[i]]() }
      }
    }
    return t
  } else {
    bind = t
    t = getOrigin(t, key)
    if (!t && val !== void 0) {
      set(bind, { [key]: val }, stamp)
      t = get(bind, key)
    } else {
      if (typeof t === 'function') { t = bind[key]() }
    }
    return t
  }
}
