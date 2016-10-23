const { props } = require('./props')
const { property } = require('./property')
exports.instances = false
exports.props = props
props['*'] = (t, val, key, stamp) => property(t, val, key, stamp, exports)
