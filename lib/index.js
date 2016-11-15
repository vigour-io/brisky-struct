const ms = require('monotonic-timestamp')
const { create, set } = require('./manipulate')
const { get } = require('./get')
const { compute, origin } = require('./compute')
const { parent, root, path } = require('./traversal')
const { getKeys } = require('./keys')
const once = require('./once')
const struct = require('./struct')
const getApi = require('./get/api')
const { generic } = require('./emit')

const chain = (changed, t) => changed && changed !== true ? changed : t

// add serialize
// add advanced get behaviour ('[0]') etc
// add subscriptions
// add '$', 'root' add the dolar sign arrays

set(struct, {
  define: {
    parent () { return parent(this) },
    root () { return root(this) },
    inspect () {
      // make this optional (too much code for only devving)
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
      // make a debug injectable that adds this
    },
    emit (type, val, stamp) {
      generic(this, type, val, stamp)
      return this
    },
    once (check, callback) {
      return once(this, check, callback)
    },
    path () {
      return path(this)
    },
    set (val, stamp) {
      return chain(set(this, val, stamp), this)
    },
    create (val, stamp) {
      return create(this, val, stamp)
    },
    get (key, val, stamp) {
      return getApi(this, key, val, stamp)
    },
    compute (val) {
      return compute(this, val)
    },
    origin () {
      return origin(this)
    },
    keys () {
      return getKeys(this)
    },
    reduce (fn, start) {
      return getKeys(this).map(key => get(this, key)).reduce(fn, start)
    },
    map (fn, callee) {
      return getKeys(this).map((val, key, array) => fn(get(this, val), key, array))
    },
    filter (fn) {
      // later add sort and cached array methods
      // also think about syncing sort
      // syncing props
      return getKeys(this).map(key => get(this, key)).filter(fn)
    },
    forEach (fn) {
      const keys = getKeys(this)
      for (let i = 0, len = keys.length; i < len; i++) {
        let key = keys[i]
        fn(get(this, key), key, this)
      }
    },
    push (val, stamp) {
      const key = ms()
      return chain(set(this, { [key]: val }, stamp), this)[key]
    }
  }
})

module.exports = (val, stamp) => create(struct, val, stamp)
