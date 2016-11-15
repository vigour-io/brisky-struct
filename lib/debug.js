const { path } = require('./traversal')
const { getKeys } = require('./keys')

exports.define = {
  inspect () {
    var keys = getKeys(this)
    var val = this.val
    const p = path(this)
    const start = 'Struct ' + (p.length ? `${p.join('.')} ` : '')
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
