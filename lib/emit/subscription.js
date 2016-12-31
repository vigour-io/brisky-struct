import bs from 'brisky-stamp'

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
      if (p.subscriptions) exec(p)
      // if (p.context && p.contextLevel === 1) {
        // p = p.context // waht does this even mean??? -- make more tests
      // } else {
      p = p._p
      // }
    }
  }
  if (t.subscriptions) exec(t)
}

const exec = t => {
  if (!t.inProgress) {
    t.inProgress = true
    bs.on(() => {
      let i = t.subscriptions.length
      while (i--) { t.subscriptions[i]() }
      t.inProgress = false
    })
  }
}

export default subscription