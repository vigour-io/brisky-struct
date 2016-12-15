import struct from './struct'
import { create, set } from './manipulate'
import methods from './methods'
import { get } from './get'
import { getProp as getProperty, property } from './property'
import { contextProperty } from './context'

const emitterProperty = struct.props.on.struct.props.default

set(struct, { inject: methods })

const def = (val, stamp) => create(struct, val, stamp)

export default def

export {
  struct,
  get,
  getProperty,
  property,
  contextProperty,
  emitterProperty
}

/* temp hack */
def.struct = struct
def.get = get
def.getProperty = getProperty
def.property = property
def.contextProperty = contextProperty
def.emitterProperty = emitterProperty
