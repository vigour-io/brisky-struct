import bs from 'stamp'

const handleStruct = (p, stamp) => {
  if (p.emitters && p.emitters.data && p.emitters.data.struct && p.__tStamp !== stamp) {
    p.__tStamp = stamp
    let i = p.emitters.data.struct.length
    while (i--) {
      subscription(p.emitters.data.struct[i], stamp)
      handleStruct(p.emitters.data.struct[i], stamp)
    }
    p.__tStamp = null
  }
}

const subscription = (t, stamp) => {
  t.tStamp = stamp
  if (t._p || t._c) {
    let p
    if (t._c) {
      if (t._cLevel === 1) {
        p = t._c
      } else {
        p = t._p
        p._cLevel = t._cLevel - 1
        p._c = t._c
      }
    } else {
      p = t._p
    }
    while (p && (!p.tStamp || p.tStamp !== stamp)) {
      p.tStamp = stamp
      if (!p._c) {
        handleStruct(p, stamp)
      }
      if (p.subscriptions) {
        exec(p)
      }
      if (p._c) {
        if (p._cLevel === 1) {
          p = p._c
        } else {
          // have to keep for the edge case you dont have a subscription on top....
          const prev = p
          p = p._p
          p._cLevel = prev._cLevel - 1
          p._c = prev._c
        }
      } else {
        p = p._p
      }
    }
  }
  if (t.subscriptions) {
    exec(t)
  }
}

const exec = t => {
  if (!t._inProgressS) {
    t._inProgressS = true
    bs.on(() => {
      var i = t.subscriptions.length
      while (i--) { t.subscriptions[i]() }
      t._inProgressS = false
    })
  }
}

export default subscription
