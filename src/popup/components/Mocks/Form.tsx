import { useState } from 'react';

interface FormProps {
  onSubmit: (url: string, json: string, enabled: boolean) => void;
  loadMocks: () => Promise<void>;
}

const Form = ({ onSubmit, loadMocks }: FormProps) => {
  const [url, setUrl] = useState('');
  const [json, setJson] = useState('{}');
  const [enabled, setEnabled] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(json);
      onSubmit(url, parsed, enabled);
      await chrome.runtime.sendMessage({ type: 'update-mocks' });
      setUrl('');
      setJson('{}');
      setEnabled(enabled);
      await loadMocks();
      alert('Мок сохранён!');
    } catch (e) {
      alert('Invalid JSON: ' + e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mock-form">
      <div className="form-group">
        <label>URL запроса</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Ответ (JSON)</label>
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          rows={10}
          required
          style={{ marginBottom: 10 }}
        />
        <div style={{ marginBottom: 12 }}>
          <label
            htmlFor="json-upload"
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              backgroundColor: '#2196f3',
              color: '#fff',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            📂 Импортировать JSON
          </label>
          <input
            id="json-upload"
            type="file"
            accept=".json,application/json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const reader = new FileReader();
              reader.onload = (event) => {
                try {
                  const text = event.target?.result as string;
                  const parsed = JSON.parse(text);
                  setJson(JSON.stringify(parsed, null, 2));
                } catch (error) {
                  alert('Ошибка при чтении JSON: ' + error);
                }
              };
              reader.readAsText(file);
            }}
            style={{ display: 'none' }}
          />
        </div>
      </div>
      <div className="form-group checkbox">
        <label>
          <input
            type="checkbox"
            checked={enabled}
            onChange={() => setEnabled(!enabled)}
          />
          Включено
        </label>
      </div>
      <button type="submit" className="save-button">
        💾 Сохранить мок
      </button>
      <style>{`
        .mock-form {
          background: #f9f9f9;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #ddd;
        }
        .form-group {
          margin-bottom: 12px;
        }
        label {
          font-weight: 500;
          margin-bottom: 4px;
          display: block;
        }
        input[type='text'],
        textarea {
          width: 95%;
          padding: 8px;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-family: monospace;
        }
        .checkbox {
          display: flex;
          align-items: center;
        }
        .save-button {
          padding: 8px 16px;
          background-color: #4caf50;
          border: none;
          color: white;
          border-radius: 6px;
          cursor: pointer;
        }
        .save-button:hover {
          background-color: #43a047;
        }
      `}</style>
    </form>
  );
};

export default Form;
