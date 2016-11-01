require('nodent')()

const { create, set, get, struct, compute } = require('../')
const stamp = require('brisky-stamp')

const defer = (val, time = 100) => new Promise(resolve => setTimeout(() => resolve(val + 1), time))

const a = create(struct, {
  on: {
    data: {
      // a: (t, val, stamp) => set(t, defer(compute(t)), stamp),
      log: (t, val, stamp) => console.log('yo!', stamp, compute(t))
    }
  }
})

// set(a, null, 'x')

// console.log('go go go go')
var s = stamp.create('click')
// console.log(s)

// when things are done at the same time add them to one stamp one set much better
// so just check in the queue for all that are done make one set obj for them
// need to support async inputs in .val as well!

// merge them together

// 1 .movies .discover
// 2 .channels .discover
// 3 .news .discover

// set()

const tellYouLater = async sayWhat => {
  await defer(100, 2e3)
  return sayWhat
}

set(a, tellYouLater('hahaha'), s)

set(a, function* (t, stamp) {
  for (var i = 0; i < 3; i++) {
    yield tellYouLater('gen-' + i, 1e3)
  }
}, s)

set(a, function* logGenerator () {
  for (var i = 0; i < 3; i++) {
    yield defer('gen-' + i, 1e3)
  }
}, s)

// set(a, defer(100), s)

// set(a, defer(100), s)
// set(a, defer(200), s)
// set(a, defer(300, 1e3), s)
// set(a, defer({ val: 500, haha: true }), s)
// set(a, defer(600), s)

// set(a, defer('james'), s)
// set(a, defer('mustafa'), s)

// var bla = [
//   1,
//   2,
//   3
// ]

// for(var x of bla) {
//   console.log(x)
// }

// console.log(bla[Symbol.iterator]())
// set(a, bla[Symbol.iterator](), s)

// setTimeout(() => {
//   set(a, 1000, 'bla')
// }, 500)

set({
  xxx: true,
  y: true,
  x: true
})

set({
  blabla: true
})

// arr.forEach(() => set(a, new Promise()))

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
