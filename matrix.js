'use strict'

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('matrix')
const ctx = canvas.getContext('2d')

function setupCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

setupCanvas()

function randomRange(a, exclusiveB) {
  return (Math.random() * (exclusiveB - a) | 0) + a
}

let charStreams = []
let randomTexts = [
  '[root@156.81.12.5]# ls /www/wwwroot',
  'drdilyor developer',
  'function(',
  'inoremap <nowait><expr> <tab> MyTabImpl()'
]

function newCharStream() {
  let text = randomTexts[randomRange(0, randomTexts.length)]
  let history = []
  let current = {
    x: randomRange(0, canvas.width),
    y: randomRange(0, canvas.height),
    index: 0,
    opacity: 1.0,
  }
  let direction = ['horizontal', 'vertical'][randomRange(0, 2)]
  let isOver = false
  let char = {
    width: 16,
    height: 24,
  }

  let timeSinceLastUpdate = 0
  const ADVANCE_MS = 200
  const CHAR_DURATION = 2000

  return {
    draw(elapsed = 20) {
      if (current.index >= text.length) {
        isOver = true
      }
      if (isOver && history[history.length - 1].opacity <= 0) {
        return false
      }

      if (!isOver && (timeSinceLastUpdate += elapsed) >= ADVANCE_MS) {
        timeSinceLastUpdate %= ADVANCE_MS

        history.push(current)
        current = {...current, opacity: 1.0}
        current.index += 1

        if (direction == 'horizontal') {
          current.x += char.width
        } else {
          current.y += char.height
        }
      }

      for (const item of history) {
        if (item.opacity <= 0) {
          continue
        }
        ctx.fillStyle = item == history[history.length]
          ? '#ffffff'
          : `rgba(0, 255, 0, ${item.opacity})`
        ctx.font = `${char.height}px "IBM Plex Mono", monospace`
        ctx.fillText(text[item.index], item.x, item.y)
        item.opacity -= elapsed / CHAR_DURATION
      }

      return true
    },
  }
}

function update(elapsed) {
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  charStreams = charStreams.filter(i => i.draw(elapsed))
}

let start = performance.now() | 0
const FRAME_MS = 1000 / 15

setTimeout(function self() {
  let now = performance.now() | 0
  let elapsed = now - start
  start = now

  update(elapsed)
  let updateTime = performance.now() - now
  console.log(FRAME_MS - updateTime)
  setTimeout(self, FRAME_MS - updateTime)
})

update(0)


setInterval(function() {
  charStreams.push(newCharStream())
}, 100)

window.addEventListener('resize', setupCanvas)
