const { create, set } = require('./manipulate')
const { helper, get } = require('./get')
const { compute, origin } = require('./compute')
const ms = require('monotonic-timestamp')
// just make helper here
// all api funcitons straight here here

exports.create = create
exports.set = set
exports.get = helper
exports.compute = compute
exports.origin = origin
exports.emit = require('./emit').generic
exports.struct = require('./struct')

exports.add = (t, val, stamp) => {
  // also use UID of process
  // get default (speed it the fuck up)
  set(t, { [ms()]: val }, stamp)
}
// add
