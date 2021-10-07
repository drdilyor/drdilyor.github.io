const navbar = document.querySelector('.navbar__wrapper')

window.addEventListener('scroll', function() {
  if (scrollY < document.querySelector('.page-head').clientHeight) {
    navbar.classList.remove('is-shown')
  } else {
    navbar.classList.add('is-shown')
  }
}, {passive: true})
