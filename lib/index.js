const ms = require('monotonic-timestamp')
const { create, set } = require('./manipulate')
const { helper } = require('./get')
const { compute, origin } = require('./compute')
const { parent, root } = require('./traversal')
const { getKeys } = require('./keys')
const struct = require('./struct')

const chain = (changed, t) => changed && changed !== true ? changed : t

set(struct, {
  define: {
    parent: { get () { return parent(this) } },
    root: { get () { return root(this) } },
    set (val, stamp) {
      return chain(set(this, val, stamp), this)
    },
    create (val, stamp) {
      return create(this, val, stamp)
    },
    get (key, val, stamp) {
      return helper(this, key, val, stamp)
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
    push (val, stamp) {
      const key = ms()
      return chain(set(this, { [key]: val }, stamp), this)[key]
    }
  }
})

module.exports = (val, stamp) => create(struct, val, stamp)
