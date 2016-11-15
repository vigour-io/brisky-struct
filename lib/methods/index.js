const ms = require('monotonic-timestamp')
const { compute, origin } = require('../compute')
const { parent, root, path } = require('../traversal')
const { create, set } = require('../manipulate')
const { getKeys } = require('../keys')
const once = require('../once')
const getApi = require('../get/api')
const { generic } = require('../emit')
const chain = (c, t) => c === null || c && c !== true ? c : t
const serialize = require('../serialize')

exports.inject = [
  require('./functional')
]

var listenerId = 0
exports.define = {
  serialize (fn) { return serialize(this, fn) },
  parent () { return parent(this) },
  root () { return root(this) },
  emit (type, val, stamp) {
    generic(this, type, val, stamp)
    return this
  },
  once (check, callback) {
    return once(this, check, callback)
  },
  on (type, val, id) {
    if (typeof type === 'function') {
      val = type
      type = 'data'
    }
    if (!id) { id = ++listenerId }
    return chain(set(this, { on: { [type]: { [id]: val } } }), this)
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
  push (val, stamp) {
    const key = ms()
    return chain(set(this, { [key]: val }, stamp), this)[key]
  }
}
