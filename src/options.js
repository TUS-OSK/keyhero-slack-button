'use strict'

const storage = chrome.storage
function saveOptions() {
  const serverUrl = document.getElementById('url')
  const hoge = document.getElementById('hoge')
  storage.sync.set({ serverUrl: serverUrl, hoge: hoge }, () => {
    const status = document.getElementById('status')
    status.textContent = 'Settings saved.'
    setTimeout(() => {
      status.textContent = ''
    }, 800)
  })
}

document.getElementById('save').addEventListener('click', saveOptions)
