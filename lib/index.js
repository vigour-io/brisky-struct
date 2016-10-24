const { create, set } = require('./manipulate')
const { helper, get } = require('./get')
const { compute, origin } = require('./compute')

exports.create = create
exports.set = set
exports.get = helper
exports.compute = compute
exports.origin = origin
exports.keys = require('./keys').getKeys
exports.emit = require('./emit').generic
exports.key = get
exports.struct = require('./struct')
// add
