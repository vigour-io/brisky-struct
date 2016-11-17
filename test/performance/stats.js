const Stats = require('stats-js')
const stats = new Stats()
stats.setMode(0)
document.body.appendChild(stats.domElement)
const indicator = document.createElement('div')
indicator.style.backgroundColor = '#eee'
indicator.style.fontFamily = 'courier'
indicator.style.fontSize = '10px'
indicator.style.padding = '5px'
stats.domElement.appendChild(indicator)
stats.n = n => { indicator.innerHTML = `n = ${n}` }
module.exports = stats
