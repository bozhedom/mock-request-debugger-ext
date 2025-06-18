import { getAllMocks } from '../popup/indexDB';
interface RequestEntry {
  url: string;
  method: string;
  statusCode: number;
  timeStamp: string;
  statusLine?: string;
  type?: string;
  fromCache?: boolean;
  initiator?: string;
  ip?: string;
  tabId?: number;
}

const MAX_REQUESTS_PER_TAB = 100;
const requestsMap = new Map<number, RequestEntry[]>();

function createRule(
  id: number,
  url: string,
  response: object
): chrome.declarativeNetRequest.Rule {
  return {
    id,
    priority: 1,
    action: {
      type: 'redirect' as chrome.declarativeNetRequest.RuleActionType,
      redirect: {
        url: `data:application/json,${encodeURIComponent(
          JSON.stringify(response)
        )}`,
      },
    },
    condition: {
      urlFilter: url,
    },
  };
}

async function updateRulesFromMocks() {
  const mocks = await getAllMocks();

  const newRules = mocks.map(
    (mock: { url: string; response: object }, i: number) =>
      createRule(i + 1, mock.url, mock.response)
  );

  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existingRules.map((r) => r.id),
    addRules: newRules,
  });
}

function reloadActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id !== undefined) {
      chrome.tabs.reload(tabs[0].id);
    }
  });
}

chrome.runtime.onInstalled.addListener(() => {
  updateRulesFromMocks();
});

chrome.runtime.onStartup.addListener(() => {
  updateRulesFromMocks();
});

// Добавление нового запроса в лог вкладки
function logRequest(tabId: number, entry: RequestEntry) {
  const tabRequests = requestsMap.get(tabId) || [];
  tabRequests.push(entry);

  if (tabRequests.length > MAX_REQUESTS_PER_TAB) {
    tabRequests.shift();
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
      statusLine: details.statusLine ?? '',
      type: details.type ?? '',
      fromCache: details.fromCache ?? false,
      initiator: details.initiator ?? '',
      ip: details.ip ?? '',
      tabId: details.tabId ?? -1,
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
  (request, _sender, sendResponse): boolean => {
    switch (request.type) {
      case 'from-popup':
        console.log('📨 Получено сообщение от popup:1', request.type);
        return true;

      case 'INJECT_CONTENT':
        console.log('🔵 Запрос на инжект content script1');
        injectContentScript();
        return true;

      case 'GET_LOGS':
        fetchActiveTabLogs(sendResponse);
        return true;

      case 'update-mocks':
        updateRulesFromMocks().then(() => sendResponse('ok'));
        reloadActiveTab();
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
