console.log('x????')
import { get } from '../get'

const reset = {
  props: {
    reset: (t, val, key, stamp, isNew, original) => {
      console.log('w00000t ????')

      // dont check for type its weird
      t.forEach((p, key) => {
        if (!original)
        p.set(null, stamp)
      })
    }
  }
}

export default reset

// val === true
// : (p, key) => val.indexOf(key) === -1 && p.set(null, stamp)
