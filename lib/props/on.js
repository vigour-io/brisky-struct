const { property, create } = require('../manipulate')
const { props } = require('./')
// const { addKey } = require('../keys')

const on = create(false, {
  instances: false
  // child: {
  //   instances: false,
  //   props,
  //   child: (t, key, val, stamp) => {
  //     addKey(t, key)
  //     t[key] = val
  //   }
  // }
})

// props.on = (t, val, key, stamp) => property(t, key, val, stamp, on)
