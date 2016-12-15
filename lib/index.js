import struct from './struct'
import { create, set } from './manipulate'
import methods from './methods'
import { get } from './get'
import { getProp as getProperty, property } from './property'
import { contextProperty } from './context'
import debug from './debug'

const emitterProperty = struct.props.on.struct.props.default

set(struct, { inject: methods })

export default (val, stamp) => create(struct, val, stamp)

export {
  struct,
  get,
  debug,
  getProperty,
  property,
  contextProperty,
  emitterProperty
}
