'use strict'
const { create, set, get, struct, compute } = require('../')
const stamp = require('brisky-stamp')

const defer = (val) => new Promise(resolve => setTimeout(() => resolve(val + 1), 1000))

const a = create(struct, {
  on: {
    data: {
      // a: (t, val, stamp) => set(t, defer(compute(t)), stamp),
      log: (t, val, stamp) => console.log('defer', stamp, compute(t))
    }
  }
})

// set(a, null, 'x')

console.log('go go go go')
var s = stamp.create('click')
console.log(s)
// set(a, defer(1), s)

// a.set(new Promise((resolve, reject) => setTimeout(() => resolve('blurrrrf'))))
function* logGenerator () {
  for (var i = 0; i < 100; i++) {
    yield defer(i)
  }
}

// once (allways a promise ofcourse)

// console.log(logGenerator)
// f instanceof GeneratorFunction

// const gen = logGenerator()
// _async // and remove it

// cancel promise -- blurx
set(a, logGenerator, s)
stamp.close(s)

// var cnt = 0
// var bla = { next: function () {
//   cnt++
//   bla.value = cnt
//   bla.done = cnt > 10
//   return bla
//   // await new Promise(resolve => setTimeout(resolve(cnt), 100))
// }}
// bla[Symbol.iterator] = bla.next

// support if [symbol.itertator]

// for (var i of bla) {
//   console.log(i)
// }

// const x = val => {
//   console.log('?', val)
//   if (val.value) {
//     console.log(val)
//     val.value.then(y => x(gen.next()))
//   } else {
//     if (val.next) { x(val.next()) }
//   }
// }



// const fn = (val) => {
//   if (val[Symbol.iterator]) {
//     // console.log(val[Symbol.iterator]().next())
//     genNext(val[Symbol.iterator]())
//   }
// }

// const genNext = (iterator, val) => {
//   if (!val || !val.done) {
//     if (val !== void 0) {
//       if (val.value && typeof val === 'object' && typeof val.value.then === 'function') {
//         val.value.then((resolved) => {
//           console.log('haha', resolved)
//           genNext(iterator, iterator.next())
//         })
//       } else {
//         console.log('haha normal')
//         genNext(iterator, iterator.next())
//       }
//     } else {
//       genNext(iterator, iterator.next())
//     }
//   }
// }

// const gen = ()
// genNext(gen, void 0)

// var xxx = [ 1, 2, 3, 4]
// // add symbol .iterator
// console.log('???', [...xxx])

// fn([1, 2, 3, 4])

// x(logGenerator())

// var gen = logGenerator()
// x(gen)
// console.log(gen.next())

// console.log(gen[Symbol.iterator])

// for (var i of gen) {
//   console.log('??', i)
// }
// gen.next()
// console.log(gen.next('pretzel')) // pretzel
// console.log(gen.next('california')) // california
// console.log(gen.next('mayonnaise')) // mayonnaise

// blurf
/*
var iterator = Symbol.iterator;

function notAGenerator() {
  var  count = 0;
  return {
    [iterator]: function() {
      return this;
    },
    next: function() {
      return {value: count++, done: false};
    }
  }
}


if (err) {
      g.throw(err); return;
    }
    g.next(body);

*/