import type { RequestEntry } from '../types';

interface Props {
  req: RequestEntry;
  isSelected: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}

export default function LogItem({
  req,
  isSelected,
  onHover,
  onLeave,
  onClick,
}: Props) {
  return (
    <li
      style={{
        ...logItemStyle,
        ...(isSelected ? logItemHoverStyle : {}),
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <span style={methodStyle}>{req.method}</span>
      <span style={statusStyle(req.statusCode)}>{req.statusCode}</span>
      <div style={{ fontWeight: 500, margin: '4px 0' }}>{req.url}</div>
      <div style={{ fontSize: '12px', color: '#666' }}>{req.timeStamp}</div>
    </li>
  );
}

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
