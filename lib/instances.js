const { addKey, removeKey } = require('./keys')
const { data } = require('./emit')

const instances = (t, val, stamp, changed) => {
  let i = t.instances.length
  if (changed === true) {
    while (--i > -1) {
      if (t.instances[i].val === void 0) {
        if (stamp) { data(t.instances[i], val, stamp) }
        if (t.instances[i].instances) { instances(t.instances[i], val, stamp, changed) }
      }
    }
  } else {
    while (--i > -1) {
      if (!t.instances[i].keys) {
        if (stamp) { data(t.instances[i], val, stamp) }
        if (t.instances[i].instances) { instances(t.instances[i], val, stamp, changed) }
      } else {
        let j = changed.length
        let needupdate
        // can save checks for instances
        while (--j > -1) {
          needupdate = true
          if (changed[i] !== 'val') {
            if (val[changed[j]] === null) {
              removeKey(t.instances[i], changed[j])
            } else {
              addKey(t.instances[i], changed[j])
            }
          }
        }
        if (needupdate) {
          if (stamp) { data(t.instances[i], val, stamp) }
          if (t.instances[i].instances) { instances(t.instances[i], val, stamp, changed) }
        }
      }
    }
  }
}

module.exports = instances
