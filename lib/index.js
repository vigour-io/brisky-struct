const { create, set } = require('./set')
const { helper, get } = require('./get')
const { properties } = require('./properties')

const struct = {
  instances: false,
  properties
}
struct.child = struct

exports.struct = struct
exports.create = create
exports.set = set
exports.get = helper
exports.key = get
exports.compute = require('./compute')
