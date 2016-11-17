'use strict'
const diff = require('./diff')
const { update, create } = require('./update')
const bs = require('brisky-stamp')

module.exports = (t, subs, cb, tree) => {
  var inProgress
  if (!t.subscriptions) { t.subscriptions = [] }
  if (!tree) { tree = {} }
  if ('val' in subs) {
    t.subscriptions.push(stamp => {
      if (!inProgress) {
        inProgress = stamp
        bs.on(stamp, () => {
          update(t, subs, cb, tree)
          inProgress = false
        })
      }
    })
    create(t, subs, cb, tree)
  } else {
    t.subscriptions.push(stamp => {
      if (!inProgress) {
        inProgress = stamp
        bs.on(stamp, () => {
          diff(t, subs, cb, tree)
          inProgress = false
        })
      }
    })
    diff(t, subs, cb, tree)
  }
  return tree
}
