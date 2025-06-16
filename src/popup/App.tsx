import { useEffect, useState } from 'react';
import Filters from './Filters';
import LogList from './LogList';
import RequestModal from './RequestModal';
import type { RequestEntry, FiltersState } from '../types';

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

  return (
    <div
      style={{ padding: '16px', fontFamily: 'Arial, sans-serif', width: 400 }}
    >
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

      {modal && <RequestModal modal={modal} onClose={() => setModal(null)} />}
    </div>
  );
}

