'use strict'

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('matrix')
const ctx = canvas.getContext('2d')

let start = performance.now()
let _matrixPlaying = false
let _pusherTimeoutId
let _loopTimeoutId
const FRAME_MS = 1000 / 15

let charStreams = []
let readableTexts = [
  '[root@156.81.12.5]# ls /www/wwwroot',
  'drdilyor developer',
  'function(',
  'inoremap <expr> <tab> MyTabImpl()',
  'javascript python backend',
  'telegram linux arch',
]

function setupCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  update(0)
}

function loop() {
  let now = performance.now()
  let elapsed = now - start
  start = now

  update(elapsed)
  let updateTime = performance.now() - now
  _loopTimeoutId = setTimeout(loop, FRAME_MS - updateTime)
}

function startMatrix() {
  if (_matrixPlaying) return
  setupCanvas()
  _loopTimeoutId = setTimeout(loop, FRAME_MS)
  _pusherTimeoutId = setTimeout(function self() {
    charStreams.push(newCharStream())
    _pusherTimeoutId = setTimeout(self, 3e5 / canvas.width)
  })
  _matrixPlaying = true
}

function stopMatrix() {
  clearTimeout(_pusherTimeoutId)
  clearTimeout(_loopTimeoutId)
  charStreams = []
  _matrixPlaying = false
}

function update(elapsed) {
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  charStreams = charStreams.filter(i => i.draw(elapsed))
}

function randomRange(a, exclusiveB) {
  return (Math.random() * (exclusiveB - a) | 0) + a
}

function nonsense() {
  const chars = [
    '$~&%[{}(=*)+]!#8`\\@/?<>',
    '卂乃匚刀乇下厶工丁乚从口尸尺丂丅凵リ山乂丫乙',
  ][randomRange(0, 2)]

  const length = randomRange(5, 15)
  let result = []

  for (let i = 0; i < length; i++) {
    result.push(chars[randomRange(0, chars.length)])
  }
  return result.join('')
}

function newCharStream() {
  let text = (Math.random() < 1 / 5)
  ? readableTexts[randomRange(0, readableTexts.length)]
  : nonsense()

  let charSize = {
    // 1024 is a random magic number
    width: text.codePointAt(0) > 1024 ? 24 : 16,
    height: 24,
  }
  let direction = [
    {x: 0, y: 1},
    {x: 1, y: 0},
  ][randomRange(0, 2)]
  let startX = randomRange(0, canvas.width) - charSize.width * 5
  let startY = randomRange(0, canvas.height) - charSize.height * 5
  let frames = [...text].map((char, index) => ({
    x: startX + direction.x * charSize.width * index,
    y: startY + direction.y * charSize.height * index,
    char,
    opacity: 0,
  }))

  let currentFrame = 0
  const ADVANCE_MS = 100
  let timeSinceLastAdvance = ADVANCE_MS
  const CHAR_DURATION = 3000

  return {
    draw(elapsed) {
      let isOver = currentFrame >= frames.length

      if (isOver && frames[frames.length - 1].opacity <= 0) {
        return false
      }

      if (!isOver && (timeSinceLastAdvance += elapsed) >= ADVANCE_MS) {
        timeSinceLastAdvance %= ADVANCE_MS
        frames[currentFrame++].opacity = 1
      }

      for (const item of frames) {
        if (item.opacity <= 0) {
          continue
        }
        ctx.fillStyle = `rgba(0, 255, 0, ${item.opacity})`
        ctx.font = `${charSize.height}px "IBM Plex Mono", monospace`
        ctx.fillText(item.char, item.x, item.y)
        item.opacity -= elapsed / CHAR_DURATION
      }

      return true
    },
  }
}

startMatrix()

window.addEventListener('resize', setupCanvas)
window.addEventListener('scroll', function() {
  if (window.scrollY < canvas.height) {
    startMatrix()
  } else {
    stopMatrix()
    // sorry for coupling things
    document.querySelector('.term__input').blur()
  }
}, {passive: true})
