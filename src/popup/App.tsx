import { useEffect, useState } from 'react';
import DetailRow from './DetailRow';
import Filters from './Filters';

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
}

const initialFilters = {
  method: 'ALL',
  statusGroup: 'ALL',
  fromCache: 'ALL',
};

export default function App() {
  const [logs, setLogs] = useState<RequestEntry[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [modal, setModal] = useState<RequestEntry | null>(null);
  const [filters, setFilters] = useState(initialFilters);

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

  const filteredLogs = logs.filter((log) => {
    const methodOk = filters.method === 'ALL' || log.method === filters.method;
    const statusOk =
      filters.statusGroup === 'ALL' ||
      Math.floor(log.statusCode / 100).toString() === filters.statusGroup;
    const cacheOk =
      filters.fromCache === 'ALL' ||
      String(log.fromCache) === filters.fromCache;

    return methodOk && statusOk && cacheOk;
  });

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

      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '20px',
          backgroundColor: '#f4f6f8',
        }}
      >
        <h3 style={{ margin: 0, marginBottom: '15px', fontSize: '16px' }}>
          Фильтры
        </h3>
        <Filters filters={filters} onChange={setFilters} />
      </div>

      <hr
        style={{
          border: 'none',
          height: 1,
          backgroundColor: '#ccc',
          marginBottom: 16,
        }}
      />

      <h3 style={{ marginBottom: 8 }}>Запросы текущей вкладки</h3>

      {filteredLogs.length === 0 ? (
        <div style={{ color: '#888' }}>Нет запросов</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {filteredLogs.map((req, i) => (
            <li
              key={i}
              style={{
                ...logItemStyle,
                ...(selectedIndex === i ? logItemHoverStyle : {}),
              }}
              onMouseEnter={() => setSelectedIndex(i)}
              onMouseLeave={() => setSelectedIndex(null)}
              onClick={() => setModal(req)}
            >
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

      {modal && (
        <>
          <div style={overlayStyle} onClick={() => setModal(null)} />
          <div style={modalStyle}>
            <h3>Детали запроса</h3>
            <DetailRow label="URL" value={modal.url} />
            <DetailRow label="Метод" value={modal.method} />
            <DetailRow
              label="Статус"
              value={
                <span style={statusStyle(modal.statusCode)}>
                  {modal.statusCode} {modal.statusLine ?? ''}
                </span>
              }
            />
            <DetailRow label="Тип" value={modal.type} />
            <DetailRow label="Из кеша" value={modal.fromCache ? 'Да' : 'Нет'} />
            <DetailRow label="Инициатор" value={modal.initiator} />
            <DetailRow label="IP-адрес" value={modal.ip} />
            <DetailRow label="Время" value={modal.timeStamp} />

            <button
              onClick={() => setModal(null)}
              style={{ ...buttonStyle, marginTop: 12 }}
            >
              Закрыть
            </button>
          </div>
        </>
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
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
};

const logItemHoverStyle: React.CSSProperties = {
  backgroundColor: '#e9ecef',
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

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '10px',
  maxWidth: '600px',
  width: '90%',
  maxHeight: '80vh',
  overflowY: 'auto',
  zIndex: 1001,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
};
