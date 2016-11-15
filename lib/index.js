const struct = require('./struct')
const { create, set } = require('./manipulate')
set(struct, { inject: require('./methods') })
module.exports = (val, stamp) => create(struct, val, stamp)
