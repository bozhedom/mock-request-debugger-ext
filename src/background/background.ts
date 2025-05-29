chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'from-popup') {
    console.log('Background: получил сообщение от popup:', message.message);
  } else if (message.type === 'INJECT_CONTENT') {
    console.log('🔵 background: пришёл запрос на инжект');

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab?.id) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content/content.js'],
        });
      }
    });
  }
});
