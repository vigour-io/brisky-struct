const { props } = require('./props')
const { property } = require('./property')
exports.instances = false
exports.props = props

// just use property for this -- bit dirty
props._struct = exports
props.default = (t, val, key, stamp) => property(t, val, key, stamp, exports)
