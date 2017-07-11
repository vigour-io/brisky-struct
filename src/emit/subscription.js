import bs from 'stamp'

const handleStruct = (p, stamp) => {
  if (p.emitters && p.emitters.data && p.emitters.data.struct && p.__tStamp !== stamp) {
    p.__tStamp = stamp
    let i = p.emitters.data.struct.length
    while (i--) {
      subscription(p.emitters.data.struct[i], stamp)
      handleStruct(p.emitters.data.struct[i])
    }
    p.__tStamp = null
  }
}

const subscription = (t, stamp) => {
  t.tStamp = stamp
  if (t._p || t._c) {
    let p = t._p
    if (t._c && t._cLevel === 1) p = t._c

    while (p && (!p.tStamp || p.tStamp !== stamp)) {
      p.tStamp = stamp
      handleStruct(p, stamp)

      if (p.subscriptions) exec(p)
      p = p._p
    }
  }
  if (t.subscriptions) exec(t)
}

const exec = t => {
  if (!t._inProgressS) {
    t._inProgressS = true
    bs.on(() => {
      let i = t.subscriptions.length
      while (i--) { t.subscriptions[i]() }
      t._inProgressS = false
    })
  }
}

export default subscription
