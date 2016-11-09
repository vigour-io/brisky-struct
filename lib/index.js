const { create, set } = require('./manipulate')
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

// parent can become a getter perhaps
exports.path = require('./traversal').path
// exports._p = require('./traversal')._p
// or push
// exports.map, every, reduce, filter

exports.push = (t, val, stamp) => {
  set(t, { [ms()]: val }, stamp)
}

const struct = require('./struct')
struct.Constructor.prototype.Constructor = struct.Constructor

// use define
// make this specific
for (let key in exports) {
  let method = exports[key]
  console.log(key)
  Object.defineProperty(struct.Constructor.prototype, key, {
    value: function (a, b, c, d, e, f) {
      return method(this, a, b, c, d, e, f)
    }
  })
}

exports.struct = struct
exports.parent = require('./traversal').parent
