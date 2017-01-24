import bs from 'brisky-stamp'

const subscription = (t, stamp, val) => {
  t.tStamp = stamp
  if (t._p || t._c) {
    let p = t._p
    if (t._c && t._cLevel === 1) {
      p = t._c
    }
    while (p && (!p.tStamp || p.tStamp[0] !== stamp[0])) {
      p.tStamp = stamp
      if (p.emitters && p.emitters.data && p.emitters.data.struct) {
        let i = p.emitters.data.struct.length
        while (i--) {
          if (global.logTimes) {
            //  Hub menu.items.vaporwave.api { val: Reddit menu.items.vaporwave { title, active, link } } null

            console.log('||||======> here we go -----', t, p, p.emitters.data.struct[i])
          }
          subscription(p.emitters.data.struct[i], stamp)
        }
      }
      if (p.subscriptions) exec(p)
      // if (p._c && p._cLevel === 1) {
        // p = p._c // waht does this even mean??? -- make more tests
      // } else {
      p = p._p
      // }
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
