'use strict'
const diff = require('./diff')
const INIT = 'new'
const UPDATE = 'update'
// const REMOVE = 'remove'
// const SWITCH = 'switch'

exports.update = (t, subs, cb, tree) => {
  if ('val' in subs && subs.val === true) {
    cb(t, UPDATE, subs, tree)
  }
  diff(t, subs, cb, tree)
}

exports.create = (t, subs, cb, tree) => {
  if ('val' in subs) { cb(t, INIT, subs, tree) }
  diff(t, subs, cb, tree)
}

exports.simpleUpdate = function simpleUpdate (t, subs, cb, tree) {
  if ('val' in subs && subs.val === true) {
    cb(t, UPDATE, subs, tree)
  }
}

// exports.switchCreate = function switchCreate (t, subs, update, tree, stamp) {
//   if ('val' in subs) {
//     update(t, INIT, stamp, subs, tree, SWITCH)
//   }
// }

// exports.switchUpdate = function switchUpdate (t, subs, update, tree, stamp) {
//   if ('val' in subs && subs.val === true) {
//     update(t, !t || t.val === null ? REMOVE : UPDATE, stamp, subs, tree, SWITCH)
//   }
// }
