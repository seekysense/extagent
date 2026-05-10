import { MemoryManagement } from '../MemoryManagement';

export function MemoryTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <MemoryManagement />
    </div>
  );
}
