'use strict'
const { create, set, get, struct, compute } = require('../')
const stamp = require('brisky-stamp')

const a = create(struct, {
  on: {
    data: { a: (t, val, stamp) => { console.log('!!!!', val, stamp) } }
  }
})

const b = create(struct, {
  val: a,
  on: {
    data: {
      1: () => {
        console.log('1a')
      }
    }
  }
})

// set(a, null, 'x')

console.log('go go go go')
var s = stamp.create('morten')
console.log(s)
set(a, new Promise((resolve, reject) => setTimeout(() => resolve('blurrrrf'), 1000)), s)
stamp.close(s)

// a.set(new Promise((resolve, reject) => setTimeout(() => resolve('blurrrrf'))))
