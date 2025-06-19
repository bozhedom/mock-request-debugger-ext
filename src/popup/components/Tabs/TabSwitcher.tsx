interface Props {
  tab: 'logs' | 'mocks';
  setTab: (tab: 'logs' | 'mocks') => void;
}

export default function TabSwitcher({ tab, setTab }: Props) {
  return (
    <div style={{ display: 'flex', marginBottom: 16 }}>
      {['logs', 'mocks'].map((t) => (
        <button
          key={t}
          onClick={() => setTab(t as 'logs' | 'mocks')}
          style={{
            flex: 1,
            padding: '8px 12px',
            backgroundColor: tab === t ? '#1a73e8' : '#e0e0e0',
            color: tab === t ? '#fff' : '#000',
            border: 'none',
            borderRadius: t === 'logs' ? '8px 0 0 8px' : '0 8px 8px 0',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {t === 'logs' ? 'Логи' : 'Моки'}
        </button>
      ))}
    </div>
  );
}
