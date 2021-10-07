document.querySelector('.page-head__content').addEventListener('click', function() {
  document.querySelector('.term__input').focus()
})

document.querySelector('.term__input').addEventListener('keydown', function(e) {
  if (e.key == 'Enter' || e.key == ' ') {
    document.querySelector('.page-head ~ .page').scrollIntoView()
  }
})
