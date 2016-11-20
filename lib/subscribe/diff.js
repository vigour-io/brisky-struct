var property, remove, any

const { get } = require('../get')

const referencedCheck = (t, key, o) => (!(key in t) || t[key] === null) &&
  (typeof t.val !== 'object' || !t.val.inherits || o === t.val || referencedCheck(t.val, key, o || t))

const diff = (t, subs, cb, tree, referenced, removed) => {
  var changed
  for (let key in subs) {
    if (key !== 'val' && key !== '$' && key !== '_' && key !== '$remove') {
      if (item(key, t, subs[key], cb, tree, referenced, removed)) {
        changed = true
      }
    }
  }
  return changed
}

const item = (key, t, subs, cb, tree, referenced, removed) => {
  if (key === 'val') {
    throw new Error('never handle .val in item')
  }

  var changed
  if (key === '$any') {
    any(t, subs, cb, tree, referenced, removed)
  } else {
    if (!referenced || referencedCheck(referenced, key, t || tree.$t)) {
      // console.log(' --->', t.path(), key, '@', referenced ? referenced.path() : '-', removed ? 'removed' : '')
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
          tree
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
          removed
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
