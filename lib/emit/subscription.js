const subscription = (t, stamp) => {
  t.tStamp = stamp
  if (t._p || t.context) {
    let p = t._p
    if (t.context && t.contextLevel === 1) {
      p = t.context
    }
    while (p && (!p.tStamp || p.tStamp[0] !== stamp[0])) {
      p.tStamp = stamp
      if (p.emitters && p.emitters.data && p.emitters.data.struct) {
        let i = p.emitters.data.struct.length
        while (i--) {
          subscription(p.emitters.data.struct[i], stamp)
        }
      }
      if (p.subscriptions) { exec(p, stamp) }
      if (p.context && p.contextLevel === 1) {
        p = t.context
      } else {
        p = p._p
      }
    }
  }
  if (t.subscriptions) {
    exec(t, stamp)
  }
}

const exec = (p, stamp) => {
  let i = p.subscriptions.length
  while (i--) { p.subscriptions[i](stamp) }
}

export default subscription
