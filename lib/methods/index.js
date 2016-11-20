const ms = require('monotonic-timestamp')
const { compute, origin } = require('../compute')
const { parent, root, path } = require('../traversal')
const { create, set } = require('../manipulate')
const { getKeys } = require('../keys')
const { generic } = require('../emit')
const once = require('../once')
const getApi = require('../get/api')
const subscribe = require('../subscribe')
const bs = require('brisky-stamp')

const chain = (c, t) => c === null || c && c !== true ? c : t
const serialize = require('../serialize')

exports.inject = [
  require('./functional'),
  require('./iterator')
  // require('../debug')
]

var listenerId = 0
exports.define = {
  serialize (fn) { return serialize(this, fn) },
  root () { return root(this) },
  path () { return path(this) },
  parent (fn) {
    if (fn !== void 0) {
      if (typeof fn === 'function') {
        let p = this
        while (p) {
          let result = fn(p)
          if (result) { return result }
          p = parent(p)
        }
      } else {
        let p = this
        while (fn-- && p) { p = parent(p) }
        return p
      }
    } else {
      return parent(this)
    }
  },
  emit (type, val, stamp) {
    if (stamp === void 0) {
      stamp = bs.create()
      generic(this, type, val, stamp)
      bs.close(stamp)
    } else {
      generic(this, type, val, stamp)
    }
    return this
  },
  subscribe (subs, cb) {
    return subscribe(this, subs, cb)
  },
  once (check, callback) { return once(this, check, callback) },
  on (type, val, id) {
    if (typeof type === 'function') {
      val = type
      type = 'data'
    }
    if (!id) { id = ++listenerId }
    const temp = { on: {} } // problem with buble cant set [type] : { [id] }
    temp.on[type] = { [id]: val }
    return chain(set(this, temp), this)
  },
  set (val, stamp) {
    if (stamp === void 0) {
      stamp = bs.create()
      const ret = chain(set(this, val, stamp), this)
      bs.close(stamp)
      return ret
    } else {
      return chain(set(this, val, stamp), this)
    }
  },
  create (val, stamp) { return create(this, val, stamp) },
  get (key, val, stamp) { return getApi(this, key, val, stamp) },
  push (val, stamp) {
    const key = ms()
    return chain(set(this, { [key]: val }, stamp), this)[key]
  },
  compute (val) { return compute(this, val) },
  origin () { return origin(this) },
  keys () { return getKeys(this) }
}
