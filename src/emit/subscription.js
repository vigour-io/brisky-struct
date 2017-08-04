import bs from 'stamp'
import { handleInheritedStruct } from './reference'

const handleStruct = (p, stamp) => {
  if (p.emitters && p.emitters.data && p.emitters.data.struct && p.__tStamp !== stamp) {
    p.__tStamp = stamp
    if (p._c) {
      // this is special!
    } else {
      let i = p.emitters.data.struct.length
      while (i--) {
        subscription(p.emitters.data.struct[i], stamp)
        handleStruct(p.emitters.data.struct[i], stamp)
      }
    }
    p.__tStamp = null
  }
}

const subscription = (t, stamp) => {
  t.tStamp = stamp
  if (t._p || t._c) {
    let p = t._c && t._cLevel === 1 ? t._c : t._p

    while (p && (!p.tStamp || p.tStamp !== stamp)) {
      p.tStamp = stamp
      handleStruct(p, stamp)
      handleInheritedStruct(p, stamp)

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
      var i = t.subscriptions.length
      while (i--) { t.subscriptions[i]() }
      t._inProgressS = false
    })
  }
}

export default subscription
