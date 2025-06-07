import { useEffect, useState } from 'react';

interface RequestEntry {
  url: string;
  method: string;
  statusCode: number;
  timeStamp: string;
}

export default function App() {
  const [logs, setLogs] = useState<RequestEntry[]>([]);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'GET_LOGS' }, (logs: RequestEntry[]) => {
      setLogs(logs?.reverse() ?? []);
    });
  }, []);

  const handleClick = () => {
    chrome.runtime.sendMessage({
      type: 'from-popup',
      message: 'Привет от popup',
    });
  };

  const handleInject = () => {
    chrome.runtime.sendMessage({ type: 'INJECT_CONTENT' });
  };

  return (
    <div
      style={{ padding: '16px', fontFamily: 'Arial, sans-serif', width: 400 }}
    >
      <div style={{ marginBottom: 16 }}>
        <button onClick={handleClick} style={buttonStyle}>
          Отправить сообщение
        </button>
        <button
          onClick={handleInject}
          style={{ ...buttonStyle, marginLeft: 8 }}
        >
          Инжектировать контент
        </button>
      </div>

      <h2 style={{ marginBottom: 8 }}>Запросы текущей вкладки</h2>

      {logs.length === 0 ? (
        <div style={{ color: '#888' }}>Нет запросов</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {logs.map((req, i) => (
            <li key={i} style={logItemStyle}>
              <span style={methodStyle}>{req.method}</span>
              <span style={statusStyle(req.statusCode)}>{req.statusCode}</span>
              <div style={{ fontWeight: 500, margin: '4px 0' }}>{req.url}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {req.timeStamp}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ===== Styles =====
const buttonStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: '#007bff',
  color: '#fff',
  cursor: 'pointer',
  fontSize: '14px',
};

const logItemStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '8px 12px',
  marginBottom: '8px',
  backgroundColor: '#f9f9f9',
};

const methodStyle: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#eee',
  color: '#333',
  borderRadius: '4px',
  fontWeight: 'bold',
  fontSize: '12px',
  padding: '2px 6px',
  marginRight: '8px',
};

const statusStyle = (code: number): React.CSSProperties => {
  let color = '#888';
  if (code >= 200 && code < 300) color = '#28a745'; // зелёный
  else if (code >= 300 && code < 400) color = '#17a2b8'; // синий
  else if (code >= 400 && code < 500) color = '#dc3545'; // жёлтый
  else if (code >= 500) color = '#ffc107'; // красный

  return {
    display: 'inline-block',
    fontWeight: 'bold',
    fontSize: '12px',
    backgroundColor: color,
    color: '#fff',
    borderRadius: '4px',
    padding: '2px 6px',
    marginRight: '8px',
  };
};
