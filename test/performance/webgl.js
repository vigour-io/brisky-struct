const PIXI = require('pixi.js')
const bs = require('brisky-stamp')
const stats = require('./stats')

document.body.style.backgroundColor = 'rgb(38,50,56)'
const renderer = PIXI.autoDetectRenderer(
  global.innerWidth, global.innerHeight,
  { backgroundColor: '0x263238' }
)
document.body.appendChild(renderer.view)
const stage = new PIXI.Container()

const canvas = document.createElement('canvas')
canvas.width = 1
canvas.height = 1
var context = canvas.getContext('2d')
context.fillStyle = 'rgb(128,263,192)'
context.fillRect(0, 0, 1, 1)
const texture = PIXI.Texture.fromCanvas(canvas)

// const texture = PIXI.Texture.fromImage('test/performance/img.png')

const struct = require('../../')
const state = struct({
  something: {
    props: {
      default: {
        scale: { $transform: val => val < 3 ? val < 0 ? 0 : val : 3 }
      }
    }
  }
})
var n = 0
var cnt = 0
var dir = 2
var growth = 1

function animate () {
  n += growth * 25
  if (n > 15e3) {
    growth = -1
  } else if (n < 0) {
    growth = 1
  }
  stats.n(n)
  stats.begin()
  cnt += dir
  if (cnt > 2500 || cnt < 1) { dir = -1 * dir }
  const x = {}
  const w = global.innerWidth
  const h = global.innerHeight
  for (let i = 0; i < n; i++) {
    x[i] = {
      x: Math.sin(i / 5 + cnt / 40) * w / 3 +
          i * 0.1 + w / 2 +
          Math.cos(i + cnt / (40 - i / 1000)) * 20,
      y: Math.cos(i / 10) * h / 3 +
          i * 0.1 + h / 3 +
          Math.sin(i + cnt / (40 - i / 1000)) * 20,
      scale: state.something[i] ? state.something[i].scale.compute() + growth * 0.01 : 0
    }
  }
  const stamp = bs.create()
  state.something.set(x, stamp)
  bs.close(stamp)
  renderer.render(stage)
  global.requestAnimationFrame(animate)
  stats.end()
}

function listen (target, type) {
  if (type === 'remove') {
    // stage.removeChild(target.sprite)
  } else {
    // console.log(target.parent().sprite)
    if (type === 'new') {
      target.sprite = new PIXI.Sprite(texture)
      stage.addChild(target.sprite)
    }
    target.sprite.x = target.x.compute()
    target.sprite.y = target.y.compute()
    target.sprite.scale.x = target.sprite.scale.y = target.scale.compute()
  }
}

// function listen2 (target, type) {
//   if (type === 'remove') {
//     // stage.removeChild(target.sprite)
//   } else {
//     // console.log(target.parent().sprite)
//     if (!target.parent().sprite) {
//       target.parent().sprite = new PIXI.Sprite(texture)
//       stage.addChild(target.parent().sprite)
//     }
//     target.parent().sprite[target.key] = target.compute()
//   }
// }
// -------------------------
// state.subscribe({
//   something: {
//     $any: {
//       x: { val: true },
//       y: { val: true }
//     }
//   }
// }, listen2)

state.subscribe({ something: { $any: { val: true } } }, listen)

animate()

// bunny.rotation += 0.1
console.log(state.something[0].scale)
