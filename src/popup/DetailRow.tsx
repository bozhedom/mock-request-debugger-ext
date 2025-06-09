export default function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 8 }}>
      <strong style={{ display: 'inline-block', width: 130 }}>{label}:</strong>
      <span>{value}</span>
    </div>
  );
}
