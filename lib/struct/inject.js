const { set } = require('../manipulate')

module.exports = (t, val, key, stamp) => {
  if (Array.isArray(val)) {
    for (let i = 0, len = val.length; i < len; i++) {
      set(t, val[i], stamp)
    }
  } else {
    set(t, val, stamp)
  }
}
