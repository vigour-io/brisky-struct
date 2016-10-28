const { property } = require('../property')
const { create, set } = require('../manipulate')
const listener = require('./listener')

const emitter = {
  instances: false,
  props: { default: listener }
}

exports.on = {
  instances: false,
  props: {
    default: emitter
  }
}
