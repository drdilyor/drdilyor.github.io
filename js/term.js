const commandElem = document.querySelector('.term__command')
const command = commandElem.textContent
let animationI = 0

setTimeout(function self() {
  commandElem.textContent = command.slice(0, animationI++)
  if (animationI <= command.length) {
    setTimeout(self, 75)
  }
})

document.querySelector('.page-head__content').addEventListener('click', function() {
  document.querySelector('.term__input').focus()
})

document.querySelector('.term__input').addEventListener('keydown', function(e) {
  const command = document.querySelector('.term__command')
  switch (e.key) {
    case 'Enter':
      execute(command.textContent)
      break
    case 'Backspace':
      command.textContent = command.textContent.slice(0, -1)
      break
    default:
      if (/^[0-9a-zA-Z$~&%[{}(=*)+\]!#@\/,.<>;:  ]$/.test(e.key)) {
        command.textContent += e.key
      } else if (e.key.startsWith('Arrow')
        || e.key.startsWith('Page')
        || 'Home End Delete Insert'.split(' ').includes(e.key)
      ) {
        alert('Term: The key you just pressed is unsupported to keep things simple.')
        console.log(e.key)
      }
  }
})

/** @param command {string} */
function execute(command) {
  if (command.startsWith('cat ')) {
    command = command.slice(4)
    if (command.startsWith('./')) {
      command = command.slice(2)
    }
    if (/^[0-9a-zA-Z._-]+$/.test(command)) {
      document.querySelector('.term__input').blur()
      const elem = document.getElementById(command)
      if (elem == null) {
        alert(`cat: ${command}: no element with such id.`)
      } else {
        elem.scrollIntoView()
      }
    } else {
      alert('Term: The command you just entered is unsupported to keep things simple.')
    }
  } else {
    alert('Term: The command you just entered is unsupported to keep things simple.')
  }
}
