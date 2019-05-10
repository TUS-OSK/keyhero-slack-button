const endpoint = document.getElementById('url')
const hoge = document.getElementById('hoge')
const auto = document.getElementById('auto')
chrome.storage.local.get({ endpoint }, r => {
  endpoint.value = r.endpoint
})
chrome.storage.local.get({ hoge }, r => {
  hoge.value = r.hoge
})
chrome.storage.local.get({ auto }, r => {
  auto.checked = r.auto
})

function saveOptions() {
  chrome.storage.local.set(
    { endpoint: endpoint.value, hoge: hoge.value, auto: auto.checked },
    () => {
      const status = document.getElementById('status')
      status.textContent = 'Settings saved.'
      setTimeout(() => {
        status.textContent = ''
      }, 800)
    }
  )
}

document.getElementById('save').addEventListener('click', () => {
  saveOptions()
})
