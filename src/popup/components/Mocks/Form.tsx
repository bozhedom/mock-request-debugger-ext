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
      setEnabled(true);
      await loadMocks();
      alert('Мок сохранён!');
    } catch (e) {
      alert('Invalid JSON: ' + e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block' }}>URL:</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block' }}>Ответ:</label>
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          style={{ width: '100%', minHeight: 150 }}
        />
      </div>
      <button type="submit">Сохранить Mock</button>
    </form>
  );
};

export default Form;
