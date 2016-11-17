const Stats = require('stats-js')
const stats = new Stats()
const bs = require('brisky-stamp')

stats.setMode(0)
document.body.appendChild(stats.domElement)
// -------------------------
const struct = require('../../')
const state = struct({ something: {} })
const amount = 14e3
// -------------------------
var cnt = 0
var dir = 2
const canvas = document.createElement('canvas')
canvas.id = 'canvas'
canvas.width = 1500
canvas.height = 1500
document.body.style.backgroundColor = 'rgb(38,50,56)'
document.body.appendChild(canvas)
const context = canvas.getContext('2d')
context.fillStyle = 'rgb(128,263,192)'
// -------------------------
function goCanvas () {
  stats.begin()
  context.clearRect(0, 0, canvas.width, canvas.height)
  cnt += dir
  if (cnt > 2500 || cnt < 1) { dir = -1 * dir }
  const x = {}
  for (let i = 0; i < amount; i++) {
    x[i] = i + cnt
  }
  const stamp = bs.create()
  state.something.set(x, stamp)
  bs.close(stamp)
  stats.end()
  global.requestAnimationFrame(goCanvas)
}
// -------------------------
function listen (target, type) {
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
  context.fillRect(x, y, 1, 1)
}
// -------------------------
const tree = state.subscribe({ something: { $any: { val: true } } }, listen)
// -------------------------
console.log('TREE', tree)
console.log('START ' + amount)
goCanvas()
