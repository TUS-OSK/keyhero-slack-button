const url = document.getElementById('url')
const cryptedToken = document.getElementById('crypted-token')
const iv = document.getElementById('iv')
const channelId = document.getElementById('channel-id')
const auto = document.getElementById('auto')
const status = document.getElementById('status')
const settings = document.getElementById('settings')
const needSave = {
  url: false,
  cryptedToken: false,
  iv: false,
  channelId: false,
  auto: false
}

chrome.storage.local.get(r => {
  url.value = r.url || ''
  cryptedToken.value = r.cryptedToken || ''
  iv.value = r.iv || ''
  channelId.value = r.channelId || ''
  auto.checked = r.auto || false
})

function saveOptions() {
  chrome.storage.local.set(
    {
      url: url.value,
      cryptedToken: cryptedToken.value,
      iv: iv.value,
      channelId: channelId.value,
      auto: auto.checked
    },
    () => {
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

settings.addEventListener('keyup', e => {
  chrome.storage.local.get(r => {
    if (r[e.target.id] === e.target.value) {
      needSave[e.target.id] = false
    } else {
      needSave[e.target.id] = true
    }
    if (
      Object.keys(needSave).some(key => {
        return needSave[key]
      }) &&
      needSave !== undefined
    ) {
      status.textContent = 'Settings is not saved yet.'
    } else {
      status.textContent = ''
    }
  })
})

auto.addEventListener('change', e => {
  chrome.storage.local.get(r => {
    if (r[e.target.id] === e.target.checked) {
      needSave[e.target.id] = false
    } else {
      needSave[e.target.id] = true
    }
    if (
      Object.keys(needSave).some(key => {
        return needSave[key]
      }) &&
      needSave !== undefined
    ) {
      status.textContent = 'Settings is not saved yet.'
    } else {
      status.textContent = ''
    }
  })
})
