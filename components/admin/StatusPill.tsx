interface Props {
  status: string;
}

export default function StatusPill({ status }: Props) {
  const map: Record<string, { label: string; class: string }> = {
    pending: { label: 'V ČAKANJU', class: 'bg-amber-100 text-amber-700' },
    confirmed: { label: 'POTRJENO', class: 'bg-green-100 text-green-700' },
    rejected: { label: 'ZAVRNJENO', class: 'bg-red-100 text-red-700' },
    completed: { label: 'ZAKLJUČENO', class: 'bg-blue-100 text-blue-700' },
    cancelled: { label: 'PREKLICANO', class: 'bg-gray-100 text-gray-700' },
  };
  const s = map[status] || { label: status.toUpperCase(), class: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${s.class}`}>
      {s.label}
    </span>
  );
}
