import type { Mock } from '../../../types';
import { deleteMock, toggleMock, updateMock } from '../../indexDB';
import { useState } from 'react';

interface Props {
  mocks: Mock[];
  setMocks: React.Dispatch<React.SetStateAction<Mock[]>>;
  loadMocks: () => Promise<void>;
}

export default function MockList({ mocks, loadMocks }: Props) {
  const [editingMock, setEditingMock] = useState<Mock | null>(null);
  const [editUrl, setEditUrl] = useState('');
  const [editJson, setEditJson] = useState('');

  const handleDelete = async (url: string) => {
    await deleteMock(url);
    await loadMocks();
    await chrome.runtime.sendMessage({ type: 'update-mocks' });
  };

  const handleToggle = async (url: string, enabled: boolean) => {
    await toggleMock(url, enabled);
    await loadMocks();
    await chrome.runtime.sendMessage({ type: 'update-mocks' });
  };

  const handleEdit = (mock: Mock) => {
    setEditingMock(mock);
    setEditUrl(mock.url);
    setEditJson(JSON.stringify(mock.response, null, 2));
  };

  const handleSaveEdit = async () => {
    if (!editingMock) return;
    try {
      const parsed = JSON.parse(editJson);

      await updateMock(editingMock.url, {
        url: editUrl,
        response: parsed,
        enabled: editingMock.enabled,
      });

      setEditingMock(null);
      await loadMocks();
      await chrome.runtime.sendMessage({ type: 'update-mocks' });
    } catch (e) {
      alert('Некорректный JSON: ' + e);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
        Сохранённые моки
      </h2>

      <div
        style={{
          maxHeight: 240,
          overflowY: 'auto',
          border: '1px solid #ccc',
          borderRadius: 8,
          padding: 12,
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
                borderBottom: '1px solid #e5e5e5',
              }}
            >
              <div
                style={{
                  color: '#1a73e8',
                  fontWeight: 500,
                  wordBreak: 'break-word',
                  marginBottom: 4,
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
                  whiteSpace: 'pre-wrap',
                  overflowX: 'auto',
                  marginBottom: 8,
                  fontFamily: 'monospace',
                }}
              >
                {JSON.stringify(mock.response, null, 2)}
              </pre>

              <div style={{ display: 'flex', justifyContent: 'center' ,alignItems: 'center', gap: 8 }}>
                {/* <input
                  type="checkbox"
                  checked={mock.enabled}
                  onChange={() => handleToggle(mock.url, !mock.enabled)}
                /> */}
                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    gap: 6,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={mock.enabled}
                    onChange={() => handleToggle(mock.url, !mock.enabled)}
                    style={{ display: 'none' }}
                  />
                  <span
                    style={{
                      width: 36,
                      height: 20,
                      borderRadius: 999,
                      backgroundColor: mock.enabled ? '#4caf50' : '#ccc',
                      position: 'relative',
                      transition: 'background-color 0.3s',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: 2,
                        left: mock.enabled ? 18 : 2,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: '#fff',
                        transition: 'left 0.3s',
                        boxShadow: '0 0 2px rgba(0,0,0,0.2)',
                      }}
                    />
                  </span>
                  <span style={{ fontSize: 13, color: '#333' }}>
                    {mock.enabled ? 'Вкл' : 'Выкл'}
                  </span>
                </label>

                <button
                  onClick={() => handleEdit(mock)}
                  style={{
                    padding: '4px 12px',
                    fontSize: 13,
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
                    padding: '4px 12px',
                    fontSize: 13,
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

      {/* Модальное окно */}
      {editingMock && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 50,
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              padding: 24,
              width: '90%',
              maxWidth: 600,
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
              Редактирование мока
            </h3>

            <label
              style={{
                fontSize: 14,
                fontWeight: 500,
                display: 'block',
                marginBottom: 4,
              }}
            >
              URL
            </label>
            <input
              style={{
                width: '100%',
                border: '1px solid #ccc',
                padding: '6px 10px',
                borderRadius: 4,
                fontFamily: 'monospace',
                fontSize: 13,
                marginBottom: 12,
              }}
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
            />

            <label
              style={{
                fontSize: 14,
                fontWeight: 500,
                display: 'block',
                marginBottom: 4,
              }}
            >
              Ответ (JSON)
            </label>
            <textarea
              style={{
                width: '100%',
                border: '1px solid #ccc',
                padding: '6px 10px',
                borderRadius: 4,
                fontFamily: 'monospace',
                fontSize: 13,
                marginBottom: 16,
                resize: 'vertical',
              }}
              rows={10}
              value={editJson}
              onChange={(e) => setEditJson(e.target.value)}
            />

            <div
              style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}
            >
              <button
                onClick={() => setEditingMock(null)}
                style={{
                  padding: '6px 16px',
                  backgroundColor: '#e5e5e5',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                Отмена
              </button>
              <button
                onClick={handleSaveEdit}
                style={{
                  padding: '6px 16px',
                  backgroundColor: '#4caf50',
                  color: '#fff',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
