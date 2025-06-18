import { useEffect, useState } from 'react';
import Filters from './Filters';
import LogList from './LogList';
import RequestModal from './RequestModal';
import type { RequestEntry, FiltersState } from '../types';
import Form from './Form';
import {
  saveMock,
  getAllMocks,
  deleteMock,
  // toggleMock,
  updateMock,
} from './indexDB';

export default function App() {
  // Логи запросов
  const [logs, setLogs] = useState<RequestEntry[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [modal, setModal] = useState<RequestEntry | null>(null);
  const [filters, setFilters] = useState<FiltersState>({
    method: 'ALL',
    statusGroup: 'ALL',
    fromCache: 'ALL',
  });
  const [tab, setTab] = useState<'logs' | 'mocks'>('logs');
  const [mocks, setMocks] = useState<{ url: string; response: object }[]>([]);

  const loadMocks = async () => {
    const all = await getAllMocks();
    setMocks(all);
  };

  useEffect(() => {
    loadMocks();
  }, []);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'GET_LOGS' }, (logs: RequestEntry[]) => {
      setLogs(logs?.reverse() ?? []);
    });
  }, []);

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

  const handleDelete = async (url: string) => {
    await deleteMock(url);
    await loadMocks();
    await chrome.runtime.sendMessage({ type: 'update-mocks' });
  };

  // const handleToggle = async (url: string, enabled: boolean) => {
  //   await toggleMock(url, enabled);
  //   await loadMocks();
  //   chrome.runtime.sendMessage('update-mocks');
  // };

  const handleEdit = (mock: { url: string; response: object }) => {
    // Можно реализовать модалку редактирования
    const newResponse = prompt(
      'Измените JSON:',
      JSON.stringify(mock.response, null, 2)
    );
    if (!newResponse) return;
    try {
      const parsed = JSON.parse(newResponse);
      updateMock(mock.url, { response: parsed }).then(async () => {
        loadMocks();
        await chrome.runtime.sendMessage({ type: 'update-mocks' });
      });
    } catch (e) {
      alert('Некорректный JSON' + e);
    }
  };

  return (
    <div
      style={{ padding: '16px', fontFamily: 'Arial, sans-serif', width: 400 }}
    >
      {/* Переключатель вкладок */}
      <div style={{ display: 'flex', marginBottom: 16 }}>
        <button
          onClick={() => setTab('logs')}
          style={{
            flex: 1,
            padding: '8px 12px',
            backgroundColor: tab === 'logs' ? '#1a73e8' : '#e0e0e0',
            color: tab === 'logs' ? '#fff' : '#000',
            border: 'none',
            borderRadius: '8px 0 0 8px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Логи
        </button>
        <button
          onClick={() => setTab('mocks')}
          style={{
            flex: 1,
            padding: '8px 12px',
            backgroundColor: tab === 'mocks' ? '#1a73e8' : '#e0e0e0',
            color: tab === 'mocks' ? '#fff' : '#000',
            border: 'none',
            borderRadius: '0 8px 8px 0',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Моки
        </button>
      </div>
      {/* Вкладка "Логи" */}

      {tab === 'logs' && (
        <>
          {' '}
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
          <LogList
            logs={filteredLogs}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
            onOpenModal={(req) => setModal(req)}
          />
          {modal && (
            <RequestModal modal={modal} onClose={() => setModal(null)} />
          )}{' '}
        </>
      )}

      {/* Вкладка "Моки" */}
      {tab === 'mocks' && (
        <>
          {' '}
          {/* Форма */}
          <div
            style={{
              padding: 16,
              borderRadius: 8,
              backgroundColor: '#ffffff',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
              marginBottom: 24,
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: 18 }}>
              Добавить мок
            </h3>
            <Form onSubmit={saveMock} loadMocks={loadMocks} />
          </div>
          {/* Список моков */}
          <h2 style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
            Сохранённые моки
          </h2>
          <div
            style={{
              maxHeight: 240,
              overflowY: 'auto',
              border: '1px solid #ddd',
              padding: 12,
              borderRadius: 8,
              backgroundColor: '#ffffff',
              marginBottom: 24,
            }}
          >
            {mocks.length === 0 ? (
              <p style={{ color: '#888', fontSize: 14 }}>
                Пока нет сохранённых моков
              </p>
            ) : (
              mocks.map((mock) => (
                <div
                  key={mock.url}
                  style={{
                    marginBottom: 16,
                    paddingBottom: 12,
                    borderBottom: '1px solid #eee',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 500,
                      color: '#1a73e8',
                      wordBreak: 'break-all',
                      marginBottom: 6,
                    }}
                  >
                    {mock.url}
                  </div>

                  <pre
                    style={{
                      backgroundColor: '#f5f5f5',
                      padding: 8,
                      borderRadius: 4,
                      fontSize: 12,
                      overflowX: 'auto',
                      whiteSpace: 'pre-wrap',
                      marginBottom: 8,
                    }}
                  >
                    {JSON.stringify(mock.response, null, 2)}
                  </pre>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => handleEdit(mock)}
                      style={{
                        fontSize: 13,
                        padding: '4px 10px',
                        backgroundColor: '#fff7cc',
                        border: '1px solid #e2c744',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    >
                      ✏️ Редактировать
                    </button>

                    <button
                      onClick={() => handleDelete(mock.url)}
                      style={{
                        fontSize: 13,
                        padding: '4px 10px',
                        backgroundColor: '#ffe5e5',
                        border: '1px solid #dd4444',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    >
                      🗑️ Удалить
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
