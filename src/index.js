import struct from './struct'
import { create as c, set } from './manipulate'
import methods from './methods'
import { get, getVal } from './get'
import { getProp as getProperty, property } from './property'
import { contextProperty } from './context'
import { subscribe, parse } from './subscribe'
import { getKeys } from './keys'
import { getType } from './struct/types'

const emitterProperty = struct.props.on.struct.props.default

set(struct, { inject: methods })

// make this nicer need to get acces to real create
const create = (val, stamp) => c(struct, val, stamp)

export {
  subscribe,
  parse,
  create,
  c, // temp
  set,
  struct,
  property,
  contextProperty,
  emitterProperty,
  get,
  getProperty,
  getKeys,
  getType,
  getVal
}
