const onData = t => t.on && t.on.data || t.inherits && onData(t.inherits)
const { getFn, getStruct } = require('./get')

// remove is going to be a bit harder

const data = (t, val, stamp) => {
  const emitters = onData(t)
  if (emitters) {
    const fn = getFn(emitters)
    const struct = getStruct(emitters)
    if (fn) {
      let i = fn.length
      while (--i > -1) { fn[i](t, val, stamp) }
    }
    if (struct) {
      let i = struct.length
      while (--i > -1) { data(struct[i], val, stamp) }
    }
  }
}

const generic = (t, type, val, stamp) => {
  // rewrite type
  if (type === 'data') {
    data(t, val, stamp)
  } else {
    // do generic emit
  }
}

exports.data = data
exports.generic = generic
