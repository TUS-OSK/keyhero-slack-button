chrome.tabs.onUpdated.addListener(tabId => {
  chrome.pageAction.show(tabId)
})

chrome.storage.onChanged.addListener(changes => {
  for (const key in changes) {
    const change = changes[key]
    console.log(change.oldValue, change.newValue)
  }
})

chrome.runtime.onMessage.addListener((req, sender, res) => {
  console.log(
    sender.tab
      ? '(event) from a content script:' + sender.tab.url
      : '(event) from the extension'
  )

  // TODO: validate parameter
  // res({ status: '400' })

  const url = req.url
  const data = {
    method: 'web.chat.postMessage',
    cryptedToken: req.cryptedToken,
    iv: req.iv,
    options: {
      text: req.text,
      channel: req.channelId
    }
  }

  const options = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  }

  fetch(url, options)
    .then(res => {
      return res.json()
    })
    .then(json => {
      console.log(`(API response) ${json}`)
    })
    .catch(err => {
      console.error(err)
    })

  // TODO: error handling
  res({ status: '200' })
})
