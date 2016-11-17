'use strict'
function walk (obj, type, field) {
  if (!type || !field || field === type) {
    return obj
  }
  for (let i in obj) {
    if (typeof obj[i] === 'object' && !obj[i].isBase) {
      obj[i] = walk(obj[i], type, field)
    }
    if (i === field) {
      obj[type] = obj[i]
      delete obj[i]
    }
  }
  return obj
}
module.exports = walk
