// dont add this in the browser
import { path } from '../traversal'
import { getKeys } from '../keys'
import { get } from '../get'

const define = {
  inspect () {
    if (this._noInspect_) {
      return this
    }
    var keys = getKeys(this)
    var val = this.val
    const p = path(this)
    var type = get(this, 'type').compute()
    const start = type && type[0].toUpperCase() + type.slice(1) + ' ' + (p.length ? `${p.join('.')} ` : '')
    if (val && typeof val === 'object' && val.inherits) {
      val = val.inspect()
    }
    if (keys) {
      if (keys.length > 10) {
        const len = keys.length
        keys = keys.slice(0, 5)
        keys.push('... ' + (len - 5) + ' more items')
      }
      return val
        ? `${start}{ val: ${val}, ${keys.join(', ')} }`
        : `${start}{ ${keys.join(', ')} }`
    } else {
      return val
        ? `${start}{ val: ${val} }`
        : `${start}{ }`
    }
  }
}

export default {
  define,
  props: { default: 'self', _noInspect_: true }
}
