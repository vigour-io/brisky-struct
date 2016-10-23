const { addKey, removeKey } = require('../keys')

module.exports = {
  instances: false,
  props: {
    default: {
      instances: false,
      props: {
        default: (t, val, key, stamp) => {
          // add removal handles etc
          addKey(t, key)
          t[key] = val
        }
      }
    }
  }
}
