const subscription = (t, stamp) => {

  console.log('go subs')
  console.warn(t)

  t.tStamp = stamp
  if (t._p || t.context) {
    let p = t._p
    if (t.context && t.contextLevel === 1) {
      p = t.context
    }
    while (p && p.tStamp !== stamp) {
      p.tStamp = stamp
      if (p.emitters && p.emitters.data && p.emitters.data.struct) {
        let i = p.emitters.data.struct.length
        console.info('????', i, p.emitters.data.struct.length, p.emitters.data.struct)
        while (i--) {
          console.log(p.emitters.data.struct[i])
          // if (p.emitters.data.struct[i]) {
          subscription(p.emitters.data.struct[i], stamp)
          // } else {
          //   console.error('fuck?', i)
          // }
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
