// scoreのDOM取得
const speed = document.querySelector('[data-reactid=".0.1.1.1.0"]')
const accuracy = document.querySelector('[data-reactid=".0.1.1.3.0"]')

// 設定の同期
const options = {}
chrome.storage.local.get(r => {
  options.url = r.url
  options.hoge = r.hoge
  options.auto = r.auto
  checkAuto(r.auto)
})
chrome.storage.onChanged.addListener(changes => {
  for (const key in changes) {
    const change = changes[key]
    options[key] = change.newValue
    console.log(`keyを${change.oldValue}から${change.newValue}に変更しました`)
    if (key === 'auto') {
      checkAuto(change.newValue)
    }
  }
})

// ゲームが終わったかの監視
const graph = document.querySelector('.flot-overlay')
const config = {
  attributes: true
}
const gameObserver = new MutationObserver(() => {
  if (options.auto) sendToSlack()
  console.log('Finished!')
})
gameObserver.observe(graph, config)

// シェアボタンの追加
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
  'line-height': '1.1',
  'text-align': 'center',
  'vertical-align': 'middle',
  cursor: 'pointer',
  'background-image': 'none',
  border: '1px solid transparent',
  'user-select': 'none',
  'border-radius': '6px',
  'box-sizing': 'border-box',
  'text-decoration': 'none',
  display: 'none'
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
  // TODO: replace slack message api
  window.alert(score)
}

function checkAuto(enableAuto) {
  if (enableAuto) {
    shareButton.style.display = 'none'
  } else if (!enableAuto) {
    shareButton.style.display = 'inline'
  } else {
    console.error('(options) something wrong')
  }
}
