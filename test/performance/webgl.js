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
context.fillRect(0, 0, 2, 2)
const texture = PIXI.Texture.fromCanvas(canvas)

const struct = require('../../')
const state = struct({ something: {} })
var n = 0
var cnt = 0
var dir = 2

function animate () {
  n += 10
  stats.n(n)
  stats.begin()
  cnt += dir
  if (cnt > 2500 || cnt < 1) { dir = -1 * dir }
  const x = {}
  for (let i = 0; i < n; i++) { x[i] = i + cnt }
  const stamp = bs.create()
  state.something.set(x, stamp)
  bs.close(stamp)
  renderer.render(stage)
  global.requestAnimationFrame(animate)
  stats.end()
}

function listen (target, type) {
  if (type === 'remove') {

  } else {
    if (type === 'new') {
      target.sprite = new PIXI.Sprite(texture)
      stage.addChild(target.sprite)
    }
    const val = target.compute()
    const i = target.key
    const x =
      Math.sin(val / 5 + cnt / 40) * 300 +
      i * 0.02 + 500 +
      Math.cos(val + cnt / (40 - i / 1000)) * 10
    const y =
      Math.cos(val / 10) * 300 +
      i * 0.02 + 500 +
      Math.sin(val + cnt / (40 - i / 1000)) * 10
    target.sprite.x = x
    target.sprite.y = y
  }
}
// -------------------------
state.subscribe({ something: { $any: { val: true } } }, listen)
animate()
// bunny.rotation += 0.1
