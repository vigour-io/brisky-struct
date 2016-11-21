const { removeReference } = require('./remove')
const { diff } = require('../diff')

const isStruct = t => t.val && typeof t.val === 'object' && t.val.inherits

const updateReference = (t, subs, cb, tree, referenced) => {
  if (isStruct(t)) {
    if (tree.val && tree.val.$t !== t.val) {
      const previous = tree.val.$t
      removeReference(subs, cb, tree.val, referenced)
      reference(t.val, subs, cb, tree, referenced, previous)
    } else {
      reference(t.val, subs, cb, tree, referenced)
    }
  } else if (tree.val) {
    removeReference(subs, cb, tree.val)
  }
}

const createReference = (t, subs, cb, tree, referenced, previous) => {
  if (isStruct(t)) {
    reference(t.val, subs, cb, tree, referenced, previous)
  }
}

const reference = (t, subs, cb, tree, referenced, previous) => {
  var branch = tree.val
  const stamp = t.tStamp || t.stamp || 0
  if (!branch) {
    branch = tree.val = { _p: tree, _key: 'val', $t: t }
    branch.$ = stamp
    if (previous) {
      diff(t, subs, cb, branch, void 0, referenced, previous)
      createReference(t, subs, cb, branch, referenced, previous)
    } else {
      diff(t, subs, cb, branch, void 0, referenced)
      createReference(t, subs, cb, branch, referenced)
    }
    return true
  } else if (branch.$ !== stamp) {
    branch.$ = stamp
    diff(t, subs, cb, branch, void 0, referenced)
    updateReference(t, subs, cb, branch, referenced)
    return true
  }
}

exports.createReference = createReference
exports.updateReference = updateReference
