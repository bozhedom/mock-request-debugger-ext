interface RequestEntry {
  url: string;
  method: string;
  statusCode: number;
  timeStamp: string;
}

const requests = new Map<number, RequestEntry[]>();

chrome.webRequest.onCompleted.addListener(
  (details) => {
    // Проверка tabId
    if (details.tabId !== undefined && details.tabId >= 0) {
      const entry: RequestEntry = {
        url: details.url,
        method: details.method,
        statusCode: details.statusCode ?? 0,
        timeStamp: new Date(details.timeStamp).toLocaleTimeString(),
      };

      if (!requests.has(details.tabId)) {
        requests.set(details.tabId, []);
      }

      requests.get(details.tabId)!.push(entry);

      // Ограничение количества логов
      if (requests.get(details.tabId)!.length > 100) {
        requests.get(details.tabId)!.shift();
      }
    }
  },
  { urls: ['<all_urls>'] }
);

// Очистка при закрытии вкладки
chrome.tabs.onRemoved.addListener((tabId) => {
  requests.delete(tabId);
});

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.tabId >= 0) {
    requests.set(details.tabId, []); // сбрасываем запросы для вкладки
    console.log(`🧹 Очищен лог для вкладки ${details.tabId}`);
  }
});

chrome.runtime.onMessage.addListener(
  (
    message: { type: string },
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void
  ): boolean | void => {
    if (message.type === 'from-popup') {
      console.log('Background: получил сообщение от popup:', message.type);
      return true;
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
      return true;
    } else if (message.type === 'GET_LOGS') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0]?.id;
        console.log(tabId);
        console.log(requests);

        if (typeof tabId === 'number' && tabId >= 0) {
          sendResponse(requests.get(tabId) || []);
        } else {
          sendResponse([]);
        }
      });
      return true; // 🔥 ОБЯЗАТЕЛЬНО!
    }
  }
);
