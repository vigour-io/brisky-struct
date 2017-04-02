import { get, getOrigin } from './'
import { set } from '../manipulate'

export default (t, key, val, stamp, noContext) => {
  var bind

  // if typeof key === 'fn' // do somehting as well

  if (typeof key === 'object') {
    if (val !== void 0) {
      for (let i = 0, len = key.length; t && i < len; i++) {
        bind = t
        t = getOrigin(t, key[i], noContext)
        if (!t) {
          let ret = set(bind, { [key[i]]: i === len - 1 ? val : {} }, stamp)
          if (ret && ret.inherits) { bind = ret }
          t = get(bind, key[i], noContext)
        }
        if (typeof t === 'function') { t = bind[key[i]]() }
      }
    } else {
      for (let i = 0, len = key.length; t && i < len; i++) {
        bind = t
        t = get(t, key[i], noContext) || getOrigin(t, key[i], noContext)
        if (typeof t === 'function' && whitelist(key[i])) { t = bind[key[i]]() }
      }
    }
    return t
  } else {
    bind = t
    t = getOrigin(t, key, noContext)
    if (!t && val !== void 0) {
      set(bind, { [key]: val }, stamp)
      t = get(bind, key, noContext)
    } else {
      if (typeof t === 'function' && whitelist(key)) { t = bind[key]() }
    }
    return t
  }
}

const whitelist = key =>
  key === 'root' ||
  key === 'parent' ||
  key === 'compute' ||
  key === 'origin'
