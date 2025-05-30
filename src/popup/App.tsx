chrome.runtime.sendMessage({ type: 'GET_LOGS' }, (logs) => {
  const ul = document.getElementById('logList');

  if (!logs || logs.length === 0) {
    if (ul) {
      ul.innerHTML = '<li>Нет запросов</li>';
    }
    return;
  }

  logs
    .reverse()
    .forEach(
      (req: {
        method: string;
        url: string;
        statusCode: number;
        timeStamp: number;
      }) => {
        const li = document.createElement('li');
        li.textContent = `${req.method} ${req.url} (${req.statusCode}) [${req.timeStamp}]`;
        if (ul) {
          ul.appendChild(li);
        }
      }
    );
});

export default function App() {
  const handleClick = () => {
    console.log('Popup: кнопка нажата, отправляю сообщение');
    chrome.runtime.sendMessage({
      type: 'from-popup',
      message: 'Привет от popup',
    });
  };

  const handleInject = () => {
    chrome.runtime.sendMessage({ type: 'INJECT_CONTENT' });
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={handleClick}>Отправить сообщение</button>
      <button onClick={handleInject}>Инжектировать контент</button>

      <h1>Запросы текущей вкладки</h1>
      <ol id="logList"></ol>
    </div>
  );
}
