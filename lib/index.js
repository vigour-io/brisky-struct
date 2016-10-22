const { create, set } = require('./manipulate')
const { helper, get } = require('./get')
const { properties } = require('./properties')

// make a nice palce for this
const struct = {
  instances: false,
  properties
}
// make a nice place for that
struct.child = struct

exports.struct = struct
exports.create = create
exports.set = set
exports.get = helper
exports.compute = require('./compute')

exports.add = require('./add')
exports.key = get
