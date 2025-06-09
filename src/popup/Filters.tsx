const initialFilters = {
  method: 'ALL',
  statusGroup: 'ALL',
  fromCache: 'ALL',
};

export default function Filters({
  filters,
  onChange,
}: {
  filters: typeof initialFilters;
  onChange: (newFilters: typeof initialFilters) => void;
}) {
  const filterButton = (
    label: string,
    value: string,
    group: keyof typeof filters
  ) => (
    <button
      onClick={() => onChange({ ...filters, [group]: value })}
      style={{
        padding: '4px 10px',
        borderRadius: '20px',
        border: '1px solid #ccc',
        backgroundColor: filters[group] === value ? '#007bff' : '#fff',
        color: filters[group] === value ? '#fff' : '#333',
        fontSize: '13px',
        cursor: 'pointer',
        marginRight: 6,
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ marginBottom: 6, fontWeight: 'bold' }}>Метод</div>
      <div style={{ marginBottom: 10 }}>
        {filterButton('Все', 'ALL', 'method')}
        {filterButton('GET', 'GET', 'method')}
        {filterButton('POST', 'POST', 'method')}
        {filterButton('PUT', 'PUT', 'method')}
        {filterButton('DELETE', 'DELETE', 'method')}
      </div>

      <div style={{ marginBottom: 6, fontWeight: 'bold' }}>Статус</div>
      <div style={{ marginBottom: 10 }}>
        {filterButton('Все', 'ALL', 'statusGroup')}
        {filterButton('2xx', '2', 'statusGroup')}
        {filterButton('3xx', '3', 'statusGroup')}
        {filterButton('4xx', '4', 'statusGroup')}
        {filterButton('5xx', '5', 'statusGroup')}
      </div>

      <div style={{ marginBottom: 6, fontWeight: 'bold' }}>Кэш</div>
      <div>
        {filterButton('Все', 'ALL', 'fromCache')}
        {filterButton('Из кэша', 'true', 'fromCache')}
        {filterButton('Без кэша', 'false', 'fromCache')}
      </div>
    </div>
  );
}
