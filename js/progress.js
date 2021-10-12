// Animate progress when user scrolls down to them.
// Make sure there is at least `DELAY` delay between animations.
//
/** @type {{elem: HTMLElement, startedAt: number}[]} */
let progressElems = [...document.querySelectorAll('.skill__progress')].map(progress => ({
  elem: progress,
  startedAt: -1,
}))

const DELAY = 100
const SCROLL_BOTTOM_PADDING = 50

window.addEventListener('scroll', function self() {
  const now = performance.now()
  let allStarted = true

  for (let i = 0; i < progressElems.length; i++) {
    const progress = progressElems[i]
    if (progress.startedAt != -1) {
      continue
    }
    allStarted = false
    const rect = progress.elem.getBoundingClientRect()

    if (rect.bottom + SCROLL_BOTTOM_PADDING < window.innerHeight) {
      progress.elem.classList.add('skill__progress--animate')
      progress.startedAt = now
      if (i == 0) {
        continue
      }

      const lastStarted = progressElems[i - 1].startedAt
      if (lastStarted + DELAY > now) {
        const delay = lastStarted + DELAY - now
        progress.startedAt += delay
        progress.elem.style.animationDelay = `${delay}ms`
      }
    } else {
      break
    }
  }

  if (allStarted) {
    window.removeEventListener('scroll', self)
  }
}, {passive: true})
