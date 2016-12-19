import { create as struct } from '../../../lib/'
import bs from 'brisky-stamp'
import logger from './log'

const inDriverTree = (p) => {
  // while (p) {
  //   if (typeof p._key === 'string' && /^\$.+\*$/.test(p._key)) {
  //     return true
  //   } else {
  //     p = p._p
  //   }
  // }
}

export default (t, state, subs, log) => {
  state = state.inherits ? state : struct(state)
  var updates = []
  const tree = state.subscribe(
    subs,
    (state, type, subs, tree) => {
      if (!inDriverTree(tree)) {
        let path = state && state.path().join('/')
        let obj = {
          type: type,
          tree: tree
        }
        if (path) {
          obj.path = path
        }
        if (log) {
          console.log('FIRE:', path, type, treePath(tree))
        }
        updates.push(obj)
      }
    }
  )
  var seed = !state.stamp ? bs.cnt : state.stamp - 1
  return function test (label, updated, val) {
    if (val) {
      updates = []
      const stamp = bs.create()
      state.set(val, stamp)
      bs.close(stamp)
    }
    const info = updated.length === 0
      ? 'does not fire updates for '
      : 'fires updates for '
    resolveUpdatesTrees(updates, updated, seed)
    resolveSubsTypeChecks(updates, updated)
    t.deepEqual(updates, updated, `${info} "${label}"`)
    tree.inspect = false
    Object.defineProperty(tree, 'inspect', {
      value () {
        return logger(this)
      },
      enumerable: false
    })
    return { tree: tree, state: state }
  }
}

function treePath (tree) {
  var path = []
  var p = tree
  while (p && p._key) {
    path.push(p._key)
    p = p._p
  }
  return path.reverse().join('/')
}

function resolveUpdatesTrees (updates, updated, seed) {
  for (let i = 0, len = Math.max(updated.length, updates.length); i < len; i++) {
    if (!updated[i] || !updated[i].tree) {
      if (updates[i]) {
        delete updates[i].tree
      }
    } else if (updated[i] && updated[i].tree && updates[i]) {
      if (typeof updated[i].tree === 'string') {
        updates[i].tree = treePath(updates[i].tree)
      } else {
        let testtree = copy(updated[i].tree)
        resolveStamps(testtree, seed)
        updates[i].tree = testtree
      }
    }
  }
}

function resolveSubsTypeChecks (updates, updated) {
  for (let i = 0, len = Math.max(updated.length, updates.length); i < len; i++) {
    if (!updated[i] || !updated[i].sType) {
      if (updates[i]) {
        delete updates[i].sType
      }
    }
  }
}

function resolveStamps (tree, seed) {
  for (let key in tree) {
    if (key !== '$ref') {
      if (typeof tree[key] === 'object' && key !== '$' && key !== '$$') {
        resolveStamps(tree[key], seed)
      } else if (key !== 'val') {
        if (tree[key] instanceof Array) {
          let val = 0
          for (let i in tree[key]) {
            val += tree[key][i] !== 0 ? (tree[key][i] + seed) : 0
          }
          tree[key] = val
        } else if (!isNaN(tree[key]) && tree[key] !== 0) {
          tree[key] = tree[key] + seed
        }
      }
    }
  }
}

function copy (tree, strip) {
  const result = {}
  if (tree instanceof Array) {
    return tree.concat()
  } else {
    for (let i in tree) {
      if ((i !== '$' && i !== '$t') || !strip) {
        if (tree[i] && typeof tree[i] === 'object' && !tree[i].inherits) {
          result[i] = copy(tree[i], strip)
        } else {
          result[i] = tree[i]
        }
      }
    }
    return result
  }
}
