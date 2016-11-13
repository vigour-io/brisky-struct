const { get } = require('./')
const { set } = require('../manipulate')

module.exports = (t, key, val, stamp) => {
  var bind
  if (typeof key === 'object') {
    if (val !== void 0) {
      for (let i = 0, len = key.length; t && i < len; i++) {
        bind = t
        t = get(t, key[i])
        if (!t) {
          set(bind, { [key[i]]: i === len - 1 ? val : {} }, stamp)
          t = get(bind, key[i])
        }
        if (typeof t === 'function') { t = bind[key[i]]() }
      }
    } else {
      for (let i = 0, len = key.length; t && i < len; i++) {
        bind = t
        t = get(t, key[i])
        if (typeof t === 'function') { t = bind[key[i]]() }
      }
    }
    return t
  } else {
    bind = t
    t = get(t, key)
    if (!t && val !== void 0) {
      set(bind, { [key]: val }, stamp)
      t = get(bind, key)
    } else {
      if (typeof t === 'function') { t = bind[key]() }
    }
    return t
  }
}
