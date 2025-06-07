interface RequestEntry {
  url: string;
  method: string;
  statusCode: number;
  timeStamp: string;
}

const MAX_REQUESTS_PER_TAB = 100;
const requestsMap = new Map<number, RequestEntry[]>();

// Добавление нового запроса в лог вкладки
function logRequest(tabId: number, entry: RequestEntry) {
  const tabRequests = requestsMap.get(tabId) || [];
  tabRequests.push(entry);

  if (tabRequests.length > MAX_REQUESTS_PER_TAB) {
    tabRequests.shift(); // удаляем самый старый
  }

  requestsMap.set(tabId, tabRequests);
}

// Обработчик завершённых запросов
chrome.webRequest.onCompleted.addListener(
  (details) => {
    if (details.tabId === undefined || details.tabId < 0) return;

    const entry: RequestEntry = {
      url: details.url,
      method: details.method,
      statusCode: details.statusCode ?? 0,
      timeStamp: new Date(details.timeStamp).toLocaleTimeString(),
    };

    logRequest(details.tabId, entry);
  },
  { urls: ['<all_urls>'] }
);

// Очистка логов при закрытии вкладки
chrome.tabs.onRemoved.addListener((tabId) => {
  requestsMap.delete(tabId);
});

// Очистка логов при переходе на новый URL
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.tabId >= 0) {
    requestsMap.set(details.tabId, []);
  }
});

// Обработчик входящих сообщений от popup и других компонентов
chrome.runtime.onMessage.addListener(
  (message: { type: string }, _sender, sendResponse): boolean => {
    switch (message.type) {
      case 'from-popup':
        console.log('📨 Получено сообщение от popup:1', message.type);
        return true;

      case 'INJECT_CONTENT':
        console.log('🔵 Запрос на инжект content script1');
        injectContentScript();
        return true;

      case 'GET_LOGS':
        fetchActiveTabLogs(sendResponse);
        return true;

      default:
        return false;
    }
  }
);

// Внедрение content script в активную вкладку
function injectContentScript() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0]?.id;
    if (tabId !== undefined) {
      chrome.scripting.executeScript({
        target: { tabId },
        files: ['content/content.js'],
      });
    }
  });
}

// Отправка логов popup-у
function fetchActiveTabLogs(sendResponse: (response: RequestEntry[]) => void) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0]?.id ?? -1;
    const logs = requestsMap.get(tabId) || [];
    sendResponse(logs);
  });
}
