import LogItem from './LogItem';
import type { RequestEntry } from '../types';

interface Props {
  logs: RequestEntry[];
  selectedIndex: number | null;
  onSelect: (index: number | null) => void;
  onOpenModal: (req: RequestEntry) => void;
}

export default function LogList({
  logs,
  selectedIndex,
  onSelect,
  onOpenModal,
}: Props) {
  if (logs.length === 0) {
    return <div style={{ color: '#888' }}>Нет запросов</div>;
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {logs.map((req, i) => (
        <LogItem
          key={i}
          req={req}
          isSelected={selectedIndex === i}
          onHover={() => onSelect(i)}
          onLeave={() => onSelect(null)}
          onClick={() => onOpenModal(req)}
        />
      ))}
    </ul>
  );
}
