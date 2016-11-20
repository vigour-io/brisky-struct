var property, remove, any

const { get } = require('../get')

const referencedCheck = (t, key) => !(key in t) || t[key] === null

const getPrevious = (previous, key) => {
  console.log('>', key, previous && previous._key)
  return key in previous
  ? previous[key]
  : previous.val && getPrevious(previous.val, key)
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
  var changed
  if (key === '$any') {
    any(t, subs, cb, tree, referenced, removed, previous)
  } else {
    if (!referenced || referencedCheck(referenced, key)) {
      if (removed) {
        if (tree[key]) {
          console.log('  REMOVED')
          remove(subs, cb, tree[key], previous)
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
