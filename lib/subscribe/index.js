'use strict'
const { diff } = require('./diff')
const bs = require('brisky-stamp')

// add ref supports here -- use references field in proeprty or even simpler
const subscribe = (t, subs, cb, tree) => {
  var inProgress
  const listen = (t, fn) => t.subscriptions.push(() => {
    if (!inProgress) {
      inProgress = true
      bs.on(() => {
        inProgress = false
        fn()
      })
    }
  })

  if (!t.subscriptions) { t.subscriptions = [] }
  if (!tree) { tree = {} }

  if (subs.val) {
    if (subs.val === true) {
      listen(t, () => {
        cb(t, 'update', subs, tree)
        diff(t, subs, cb, tree)
      })
    } else {
      listen(t, () => diff(t, subs, cb, tree))
    }
    cb(t, 'new', subs, tree)
  } else {
    listen(t, () => diff(t, subs, cb, tree))
  }
  diff(t, subs, cb, tree)
  return tree
}

const parse = (subs) => {
  if (subs) {
    const result = {}
    for (let key in subs) {
      let sub = subs[key]
      if (key === 'val' || key === '_') {
        result[key] = sub
      } else {
        let type = typeof sub
        if (type === 'object') {
          result[key] = parse(sub)
        } else if (type === 'function') {
          result[key] = sub
        } else {
          result[key] = { val: sub }
        }
      }
    }
    return result
  }
}

exports.subscribe = subscribe
exports.parse = parse
