document.getElementById('thatsAll').addEventListener('click', function self(e) {
  if (e.target.classList.contains('thats-all__here')) {
    this.innerHTML = "Please don't click me again"
    // This will not work on some ancient versions of IE.
    // Because they create two seperate function:
    // one returned from this function expression,
    // another available inside this function as `self`.
    this.removeEventListener('click', self)
    this.addEventListener('click', () => this.remove())
  }
})

let aboutClicks = 0
let isDeveloper = false
document.querySelector('.page-about .page__header a').addEventListener('click', function self() {
  if (++aboutClicks == 5) {
    isDeveloper = true
    alert('Wow. You are now a developer. But there is nothing you can do in developer mode yet :)')
    this.textContent = this.textContent.slice(0, -4)
    this.removeEventListener('click', self)
  } else {
    this.textContent += '.'
  }
})

document.querySelector('.navbar__brand').addEventListener('copy', function self() {
  alert('How did you dare to copy my username? Okay, this is just an easter egg. Carry on :)')
})
