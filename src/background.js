chrome.tabs.onUpdated.addListener(tabId => {
  chrome.pageAction.show(tabId)
})

chrome.storage.onChanged.addListener(changes => {
  for (const key in changes) {
    const change = changes[key]
    console.log(change.oldValue, change.newValue)
  }
})
