const getProps = t => t.props || getProps(t.inherits)

const props = {
  instances: (t, val) => {
    t.instances = val
  },
  types: (t) => {
    // some types
  },
  $transform: (t, val) => {
    t.$transform = val
  },
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
      // no make a function to put defaults // can use that in struct
      props[key] = val[key]
    }
    if (props.propertiesMap) {
      delete props.propertiesMap
    }
  }
}

exports.props = props

// require('./on')
