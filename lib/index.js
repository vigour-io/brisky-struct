const { create, set } = require('./manipulate')
const { helper, get } = require('./get')

exports.create = create
exports.set = set
exports.get = helper
exports.compute = require('./compute')
exports.add = require('./add')
exports.keys = require('./keys').getKeys

exports.key = get
exports.struct = require('./struct')
