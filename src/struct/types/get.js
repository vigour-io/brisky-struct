import { root } from '../../traversal'
import { get } from '../../get'
import { set, create } from '../../manipulate'
import { getProp } from '../../property'

// import hash from 'string-hash'
// var cnt = 0
// const empty = hash('nill')
// const obj = {}
// const makeHash = (obj, id = 5381) => {
//   for (let key in obj) {
//     id = id * 33 ^ hash(key + '')
//     const item = obj[key]
//     if (item && typeof item === 'object') {
//       if (!item.inherits) {
//         id = id * 33 ^ makeHash(item, id)
//       }
//     } else if (typeof item === 'function') {
//       id = id * 33 ^ hash(item.toString())
//     } else if (item === null) {
//       id = id * 33 ^ empty
//     } else if (item) {
//       id = id * 33 ^ hash(item.toString() || '0')
//     }
//   }
//   return id >>> 0
// }

const getType = (parent, type, t, stamp) => {
  if (typeof type === 'object') {
    if (type.inherits) {
      return type
    } else if (type.val && type.stamp !== void 0) {
      type = type.val
    } else {
      if (!type._created) {
        type._created = create(getProp(t).struct, type, stamp, parent)
      }
      return type._created
    }
  }
  let result = getTypeInternal(parent, type, t)
  if (!result) {
    // create type
    // console.log('no result - create type', type)
    parent = root(parent)
    set(parent, { types: { [type]: {} } }, stamp)
    result = parent.types[type]
  }
  return result
}

// setTimeout(() => {
//   console.log(cnt, obj)
// }, 1e3)

const getTypeInternal = (parent, type, t) =>
  (!t || typeof type === 'string' || typeof type === 'number') &&
  (
    parent.types && get(parent.types, type) ||
    parent.inherits && getTypeInternal(parent.inherits, type) ||
    parent._p && getTypeInternal(parent._p, type)
  )

export default getType
