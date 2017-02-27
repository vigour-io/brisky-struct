import { compute, origin } from '../compute'
import { parent, root, path } from '../traversal'
import { create, set } from '../manipulate'
import { getKeys } from '../keys'
import { generic } from '../emit'
import { applyContext, storeContext } from '../context'
import once from '../once'
import getApi from '../get/api'
import bs from 'brisky-stamp'
import { subscribe, parse } from '../subscribe'
import serialize from '../serialize'
import functional from './functional'
import iterator from './iterator'
import inspect from './inspect'

// never use chain maybe remove it -- lets remove
const chain = (c, t) => c === null || c && c !== true ? c : t

var listenerId = 0

const inject = [ { define: functional }, iterator, inspect ]

const define = {
  applyContext (context) { return applyContext(this, context) },
  storeContext () { return storeContext(this) },
  serialize (fn) { return serialize(this, fn) },
  root (real) { return root(this, real) },
  path (real) { return path(this, real) },
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
      generic(this, type, val, bs.create())
      bs.close()
    } else {
      generic(this, type, val, stamp)
    }
    return this
  },
  toString () {
    const r = this.compute()
    if (typeof r === 'object' || r === void 0) {
      return ''
    } if (!isNaN(r)) {
      return r + ''
    } else {
      return r
    }
  },
  subscribe (subs, cb, raw, tree) {
    return subscribe(this, !raw ? parse(subs) : subs, cb, tree)
  },
  once (check, callback) {
    return once(this, check, callback)
  },
  on (type, val, id) {
    if (typeof type === 'function') {
      id = val
      val = type
      type = 'data'
    }
    if (!id) { id = ++listenerId }
    const temp = { on: {} } // problem with bublé cant set [type] : { [id] }
    temp.on[type] = {}
    temp.on[type][id] = val
    return chain(set(this, temp), this)
  },
  set: function (val, stamp) { // fixes buble
    if (stamp === void 0) {
      const ret = chain(set(this, val, bs.create()), this)
      bs.close()
      return ret
    } else {
      return chain(set(this, val, stamp), this)
    }
  },
  create (val, stamp) { // add all fields here
    if (stamp === void 0) {
      const ret = create(this, val, bs.create())
      bs.close()
      return ret
    } else {
      return create(this, val, stamp)
    }
  },
  // add api as a method perhaps?
  get (key, val, stamp) { return getApi(this, key, val, stamp) },
  push (val, stamp) {
    const key = bs.create()
    if (stamp === void 0) {
      const ret = chain(set(this, { [key]: val }, key), this)[key]
      bs.close()
      return ret
    } else {
      return chain(set(this, { [key]: val }, stamp), this)[key]
    }
  },
  compute: function (val, passon) { return compute(this, val, passon) }, // fixes buble
  origin () { return origin(this) },
  keys () { return getKeys(this) || [] }
}

export default { inject, define }
