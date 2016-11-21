'use strict'
const { diff } = require('../diff')
// const remove = require('../property/remove')
const { root } = require('../../traversal')
const { getOrigin } = require('../../get')

module.exports = (t, subs, cb, tree, removed) => {
  var branch = tree.$parent
  if (!removed && t) {
    const p = getParent(t, tree)
    if (!branch) {
      branch = tree.$parent = { _p: tree, _key: '$parent', $t: p }
      composite(tree, '$parent')
    }

    if (p !== branch.$t) {
      console.log('switched parent be carefull try to avoid all this stuff (too much lookup)')
      branch.$t = p
    }

    return diff(p, subs, cb, branch)
  } else if (branch) {
    diff(branch.$t, subs, cb, branch, true)
    return true
  }
}

const get = (t, path) => {
  // console.log(path, '???', t.path())
  for (let i = 0, len = path.length; t && i < len; i++) {
    if (path[i] === 'root') {
      t = root(t)
    } else {
      t = getOrigin(t, path[i])
    }
  }
  // console.log('result!', t && t.path())
  return t
}

function getParent (t, tree) {
  const path = []
  var key = '$parent'
  var parentcounter = 1
  while (tree._p) {
    if (tree._key !== '$parent') {
      key = tree._key
      tree = tree._p
      if (key === 'root') {
        path.unshift('root')
      } else if (key[0] !== '$') {
        parentcounter--
        if (parentcounter < 0) {
          path.unshift(key)
        }
      }
    } else {
      parentcounter++
      tree = tree._p
    }
  }
  return (!path.length) ? root(t) : get(root(t), path)
}

function composite (tree, type) {
  var key = type
  var parentcounter = 1
  while (tree._p && parentcounter) {
    if (tree._key !== type) {
      if (!tree.$c) { tree.$c = {} }
      tree.$c[key] = type
      key = tree._key
      tree = tree._p
      // what about root ???
      if (key[0] !== '$') { // not enough needs to handle root as well
        parentcounter--
      }
    } else {
      parentcounter++
      tree = tree._p
    }
  }
}
