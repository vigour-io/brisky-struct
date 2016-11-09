const ms = require('monotonic-timestamp')
const { create, set } = require('./manipulate')
const { helper, get } = require('./get')
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
    reduce (fn, start) {
      return getKeys(this).map(key => get(this, key)).reduce(fn, start)
    },
    map (fn, callee) {
      return getKeys(this).map((val, key, array) => fn(get(this, val), key, array))
    },
    filter (fn) {
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

/*
'use strict'
const ts = require('monotonic-timestamp')
// make fast filter and reduce
exports.define = {
  reduce (fn, start) {
    return this.keys().map(key => this[key]).reduce(fn, start)
  },
  map (fn, callee) {
    return this.keys().map((val, key, array) => fn(this[val], key, array))
  },
  filter (fn) {
    return this.keys().map(key => this[key]).filter(fn)
  },
  forEach (fn) {
    return this.each((p, key) => { fn(p, key, this) })
  },
  push (val, stamp) {
    const key = ts()
    this.set({ [key]: val }, stamp)
    return this[key]
  }
}
*/