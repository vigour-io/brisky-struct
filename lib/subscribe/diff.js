var property, remove, any

const { get } = require('../get')

const referencedCheck = (t, key, o) => (!(key in t) || t[key] === null)
&& (typeof t.val !== 'object' || !t.val.inherits || o === t.val || referencedCheck(t.val, key, o || t))

const logger = require('../../test/subscribe/util/log')

const getPrevious = (previous, key) => {
  let r = key in previous
  ? previous[key]
  : previous.val && getPrevious(previous.val, key)
  // if (key === 'field1') {
  //   // previous.__monkeyballz = true
  //   console.log(logger(previous))
  //   console.log('    lets go', key, !!r)
  // }
  return r
}

const diff = (t, subs, cb, tree, referenced, removed, previous) => {
  var changed
  for (let key in subs) {
    if (key !== 'val' && key !== '$' && key !== '_' && key !== '$remove') {
      if (item(key, t, subs[key], cb, tree, referenced, removed, previous)) {
        changed = true
      }
    }
  }
  return changed
}

const item = (key, t, subs, cb, tree, referenced, removed, previous) => {
  if (key === 'val') {
    throw new Error('never handle .val in item')
  }

  var changed
  if (key === '$any') {
    any(t, subs, cb, tree, referenced, removed, previous)
  } else {
    if (!referenced || referencedCheck(referenced, key, t || tree.$t)) {
      console.log(' --->', t.path(), key, '@', referenced ? referenced.path() : '-', removed ? 'removed' : '')
      if (removed) {
        const branch = tree[key]
        if (branch) {
          remove(subs, cb, branch)
          changed = true
        }
      } else {
        changed = property(
          key, t && get(t, key),
          subs,
          cb,
          tree,
          previous && getPrevious(previous, key)
        )
      }
    } else {
      const branch = tree[key]
      if (branch) {
        changed = diff(
          t && get(t, key),
          subs,
          cb,
          branch,
          referenced[key],
          removed,
          previous && getPrevious(previous, key)
        )
      }
    }
  }
  return changed
}

exports.item = item
exports.diff = diff

property = require('./property')
remove = require('./remove').remove
any = require('./any')
