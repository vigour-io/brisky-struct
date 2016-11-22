const { diff } = require('../diff')

const logger = require('../../../test/subscribe/util/log')

const remove = (subs, cb, tree) => {
  const t = tree.$t
  if (subs.val) { cb(t, 'remove', subs, tree) }
    // remove flag can be used (block remove that will be the new thing)
  diff(t, subs, cb, tree, true)
  const key = tree._key

  // console.log('go remove', key, tree._p._key)
  if (tree.$c) { composite(tree._p, key) }
  // console.log(tree._p._key, key)
  if (key === 'parent') {
    // console.log(logger(tree._p._p._p))
  }
  delete tree._p[key]
}

const empty = (obj) => {
  for (let key in obj) {
    return false // hit it
  }
  return true
}

const logComposites = (tree) => {
  var arr = {}
  var tt = tree
  while (tt) {
    arr[tt._key] = tt.$c
    tt = tt._p
  }
  const len = (str) => {
    var i = 15 - str.length
    while (i--) { str += ' ' }
    return '   ' + str
  }
  console.log(Object.keys(arr).map(val => {
    return len(val) + (arr[val] ? Object.keys(arr[val]).map((x) => `${x}: ${arr[val][x]}`).join(' ,') : '-')
  }).join(' \n'))
}

const treepath = (t) => {
  var arr = []
  while (t) {
    arr.unshift(t._key)
    t = t._p
  }
  return arr
}

const composite = (tree, key) => {
  var o = tree
  var x
  var rootClear
  if (!rootClear) {
    console.log('#REMOVE', key)
    x = key
    logComposites(o)
  }

  console.log(' \n-------------------------------------')
  while (tree) {
    console.log('- ' + tree._key)
    if (tree.$c) {
      if (tree.$c[key]) {
        if (tree.$c[key] === 'root') { rootClear = true }
        delete tree.$c[key]
        if (empty(tree.$c)) {
          console.log('empty!')
          delete tree.$c
          key = tree._key
          tree = tree._p
          // continue
        } else {
          console.log('not empty!')
          if (rootClear) {
            console.log('!!!!!!!!')
          }
          break
        }
      } else {
        break
      }
    } else {
      if (rootClear && tree._key === 'parent') {
        let t = tree._p
        let xx = 'parent'
        var cnt = 0
        while (t) {
          if (xx === 'root') {
            break
          }
          if (xx === 'parent') {
            cnt++
          } else {
            cnt--
          }
          if (t.$c && t.$c[xx]) {
            if (cnt) {
              t.$c[xx] = 'parent'
              for (var i in t.$c) {
                if (i !== xx) {
                  if (t.$c[i] === 'root') {
                    t = false
                  }
                }
              }
              if (t) {
                xx = t._key
                t = t._p
              }
            } else {
              delete t.$c[xx]
              if (empty(t.$c)) {
                console.log('empty!')
                delete t.$c
                xx = t._key
                t = t._p
              } else {
                break
              }
            }
          } else {
            xx = t._key
            t = t._p
          }
        }
      }
      break
    }
  }

  if (x) {
    console.log(' \nDONE REMOVE')
    logComposites(o)
  }
}

module.exports = remove
