const { create } = require('../manipulate')
const { property } = require('../property')

const getProps = t => t.props || getProps(t.inherits)

const props = {
  instances: (t, val) => { t.instances = val },
  types: (t) => {
    // some types
  },
  $transform: (t, val) => { t.$transform = val },
  props: (t, val, key, stamp) => {
    var props = t.props
    if (!props) {
      const previous = getProps(t)
      props = t.props = {}
      if (previous) {
        for (let key in previous) {
          props[key] = previous[key]
        }
      }
    }
    for (let key in val) {
      parse(props, val[key], key, stamp)
    }
    if (props.propertiesMap) {
      delete props.propertiesMap
    }
  }
}

const simple = (t, val, key) => { t[key] = val }

const parse = (t, val, key) => {
  if (val === true) {
    t[key] = simple
  } else if (val === null) {
    if (t[key]) { delete t[key] }
  } else if (typeof val !== 'function') {
    // test this / types will be handled in create (just ignores)
    t[key] = (t, val, key, stamp) =>
      property(t, val, key, stamp, create(props['*'], exports))
  } else {
    t[key] = val
  }
}

exports.props = props
exports.parse = parse

// require('./on')
