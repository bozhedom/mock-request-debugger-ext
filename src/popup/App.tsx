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
    </div>
  );
}
