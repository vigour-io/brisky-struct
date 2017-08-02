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

// can be greatly optmized parent walker is shit now
// also a tmp solution need to now why parents are not set to context - prop since youre in a ref or something
const subscription = (t, stamp) => {
  t.tStamp = stamp
  if (global.DEBUG) {
    if (!t.root().contextKey) {
      console.log('ok updating for original --->', t.path())
    }
  }
  if (t._p || t._c) {
    // just looping _p and _c should enough - this is secure though can becmre lot faster
    // by skipping the level
    let p
    if (t._c) {
      if (global.DEBUG) console.log('has c!', t.path(), t._cLevel, t._c.path())
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
        if (global.DEBUG && !p._inProgressS) console.log('EXEC SUBS>>>', p.contextKey)
        exec(p, t)
      }
      if (p._c) {
        if (p._cLevel === 1) {
          p = p._c
        } else {
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
    console.log(':X update on?')
    exec(t, t)
  }
}

const exec = (t, spawner) => {
  if (!t._inProgressS) {
    t._inProgressS = true
    const x = t.contextKey
    const spawnerHasC = spawner._c
    // const spawnerKey = spawner.root().contextKey
    bs.on(() => {
      if (global.DEBUG) {
        // t has to be ancestor
        console.log('\n\n\n💩 got an subscription update on ', x, t.contextKey, spawner.path(), spawnerHasC)
      }
      let i = t.subscriptions.length
      while (i--) { t.subscriptions[i]() }
      t._inProgressS = false
    })
  }
}

export default subscription
