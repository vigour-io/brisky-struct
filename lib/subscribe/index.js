'use strict'
const { diff } = require('./diff')

const bs = require('brisky-stamp')

// add ref supports here -- use references field in proeprty or even simpler

module.exports = (t, subs, cb, tree) => {
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

