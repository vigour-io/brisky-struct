import { getKeys } from '../keys'
import { get } from '../get'

export default struct => {
  if (typeof Symbol !== 'undefined') {
    struct.Constructor.prototype[Symbol.iterator] = function () {
      const keys = getKeys(this)
      const t = this
      var i = 0
      return {
        throw: () => {},
        // add handle for removal / change of keys
        next: () => ({
          value: get(t, keys[i++]),
          done: i === keys.length + 1
        })
      }
    }
  }
}
