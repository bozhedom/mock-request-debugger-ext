import DetailRow from './DetailRow';
import type { RequestEntry } from '../types';

interface Props {
  modal: RequestEntry;
  onClose: () => void;
}

export default function RequestModal({ modal, onClose }: Props) {
  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
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

        <button onClick={onClose} style={{ ...buttonStyle, marginTop: 12 }}>
          Закрыть
        </button>
      </div>
    </>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: '#007bff',
  color: '#fff',
  cursor: 'pointer',
  fontSize: '14px',
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
