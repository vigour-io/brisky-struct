const { create, set, Constructor } = require('./manipulate')
const { helper } = require('./get')
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
exports.once = require('./once')
exports.path = require('./traversal').path
exports.parent = require('./traversal').parent
// or push
// exports.map, every, reduce, filter

exports.push = (t, val, stamp) => {
  // also use UID of process
  // get default (speed it the fuck up)
  set(t, { [ms()]: val }, stamp)
}

for (let key in exports) {
  let method = exports[key]
  console.log(key)
  Object.defineProperty(Constructor.prototype, key, {
    value: function (a, b, c, d, e, f) {
      console.log(key)
      return method(this, a, b, c, d, e, f)
    }
  })
}

exports.struct = require('./struct')
