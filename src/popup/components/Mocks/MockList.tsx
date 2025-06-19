import type { Mock } from '../../../types';
import { deleteMock, toggleMock, updateMock } from '../../indexDB';

interface Props {
  mocks: Mock[];
  setMocks: React.Dispatch<React.SetStateAction<Mock[]>>;
  loadMocks: () => Promise<void>;
}

export default function MockList({ mocks, loadMocks }: Props) {
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
    <>
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
                <input
                  type="checkbox"
                  checked={mock.enabled}
                  onChange={() => handleToggle(mock.url, !mock.enabled)}
                  style={{ marginRight: 8 }}
                />

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
  );
}
