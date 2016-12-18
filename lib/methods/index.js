import ms from 'monotonic-timestamp'
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
import uid from '../uid'
import serialize from '../serialize'
import functional from './functional'
import iterator from './iterator'

// never use chain maybe remove it
const chain = (c, t) => c === null || c && c !== true ? c : t

var listenerId = 0

const inject = [ { define: functional }, iterator ]

const define = {
  uid () { return uid(this) },
  applyContext (context) { return applyContext(this, context) },
  storeContext () { return storeContext(this) },
  serialize (fn) { return serialize(this, fn) },
  root () { return root(this) },
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
      stamp = bs.create()
      generic(this, type, val, stamp)
      bs.close(stamp)
    } else {
      generic(this, type, val, stamp)
    }
    return this
  },
  subscribe (subs, cb, raw) {
    return subscribe(this, !raw ? parse(subs) : subs, cb)
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
  create (val, stamp) {
    if (stamp === void 0) {
      stamp = bs.create()
      const ret = create(this, val, stamp)
      bs.close(stamp)
      return ret
    } else {
      return create(this, val, stamp)
    }
  },
  // add api as a mehtod perhaps?
  get (key, val, stamp) { return getApi(this, key, val, stamp) },
  push (val, stamp) {
    const key = ms()
    return chain(set(this, { [key]: val }, stamp), this)[key]
  },
  compute (val, passon) { return compute(this, val, passon) },
  origin () { return origin(this) },
  keys () { return getKeys(this) }
}

export default { inject, define }
