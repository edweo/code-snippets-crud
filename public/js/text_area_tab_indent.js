const txtArea = document.querySelector('.txt-area')
txtArea.addEventListener('keydown', e => {
  e.stopPropagation()
  if (e.keyCode === 9) {
    e.preventDefault()
    txtArea.value += '    '
  }
})
