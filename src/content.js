// To get dom of the score
const speed = document.querySelector('[data-reactid=".0.1.1.1.0"]')
const accuracy = document.querySelector('[data-reactid=".0.1.1.3.0"]')

// To synchronize settings
const options = {}
chrome.storage.local.get(r => {
  options.url = r.url || ''
  options.cryptedToken = r.cryptedToken || ''
  options.iv = r.iv || ''
  options.auto = r.auto || false
  options.channelId = r.channelId || ''
  checkAuto(r.auto)
})
chrome.storage.onChanged.addListener(changes => {
  for (const key in changes) {
    const change = changes[key]
    options[key] = change.newValue
    console.log(
      `(options) changed the value of ${key} from ${change.oldValue} to ${
        change.newValue
      }`
    )
    if (key === 'auto') {
      checkAuto(change.newValue)
    }
  }
})

// To check if the game is over
const graph = document.querySelector('.flot-overlay')
const config = {
  attributes: true
}
const gameObserver = new MutationObserver(() => {
  if (options.auto) sendToSlack()
  const score = formatScore(speed.textContent, accuracy.textContent)
  console.log('(keyhero) Finished!')
  console.log(score)
})
gameObserver.observe(graph, config)

// To insert slack share button
const shareButton = document.createElement('button')
shareButton.onmouseenter = function() {
  shareButton.style.backgroundColor = '#962d20'
}
shareButton.onmouseleave = function() {
  shareButton.style.backgroundColor = '#dd4814'
}
shareButton.className = 'btn-share'
shareBtn = {
  'font-size': '10px',
  'font-weight': 'normal',
  'font-family': '"Ubuntu",Tahoma,"Helvetica Neue",Helvetica,Arial,sans-serif',
  'border-color': '#dd4814',
  'background-color': '#dd4814',
  color: '#ffffff',
  'text-align': 'center',
  'vertical-align': 'middle',
  cursor: 'pointer',
  'background-image': 'none',
  border: '1px solid transparent',
  'user-select': 'none',
  'border-radius': '6px',
  'box-sizing': 'border-box',
  'text-decoration': 'none',
  display: 'none',
  outline: 'none'
}
Object.keys(shareBtn).forEach(key => {
  shareButton.style[key] = shareBtn[key]
})
shareButton.onclick = sendToSlack
shareButton.appendChild(document.createTextNode('いやっほ〜！'))
const m = document.querySelector('[data-reactid=".0.1.0"]')
m.appendChild(document.createTextNode(' '))
m.appendChild(shareButton)

function formatScore(speed, accuracy) {
  const score = `Speed: ${speed} WPM\nAccuracy: ${accuracy}%`
  return score
}

function sendToSlack() {
  const score = formatScore(speed.textContent, accuracy.textContent)
  callApi(score)
  console.log(`(Call API) ${score}`)
}

function checkAuto(enableAuto) {
  if (enableAuto) {
    shareButton.style.display = 'none'
    console.log('(options) enabled auto sending')
  } else if (!enableAuto) {
    shareButton.style.display = 'inline'
    console.log('(options) disabled auto sending')
  } else {
    console.error('(options) something wrong')
  }
}

function callApi(text) {
  chrome.runtime.sendMessage(
    {
      messageType: 'api',
      url: options.url,
      cryptedToken: options.cryptedToken,
      iv: options.iv,
      channelId: options.channelId,
      text: text
    },
    res => {
      console.log(`(Call API) ${res.status}`)
    }
  )
}
