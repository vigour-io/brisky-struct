const onData = t => (t.on && t.on.data) || t.inherits && onData(t.inherits)

const data = (t, val, stamp) => {
  const emitters = onData(t)
  if (emitters) {
    const fn = emitters.fn
    // const struct = emitters.struct
    if (fn) {
      let i = fn.length
      while (--i > -1) {
        fn[i](t, val, stamp)
      }
    }
  }
}

exports.data = data
