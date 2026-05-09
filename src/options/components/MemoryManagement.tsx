import React, { useRef, useState, useEffect } from 'react';
import { useLang } from '../../i18n';
import { MemoryService } from '../../tracking/memoryService';
import { MemoryManager, Memory } from '../../agent/MemoryManager';

export function MemoryManagement() {
  const [memoryCount, setMemoryCount] = useState(0);
  const [exportStatus, setExportStatus] = useState('');
  const [importStatus, setImportStatus] = useState('');
  const [agentMemories, setAgentMemories] = useState<Memory[]>([]);
  const [agentImportStatus, setAgentImportStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const agentImportRef = useRef<HTMLInputElement>(null);
  const { t } = useLang();

  const loadAgentMemories = async () => {
    const manager = new MemoryManager([]);
    const all: Memory[] = JSON.parse(await manager.exportMemories() || '[]');
    setAgentMemories(all);
  };

  const handleValidate = async (id: string) => {
    const manager = new MemoryManager([]);
    await manager.markValidated(id);
    await loadAgentMemories();
  };

  const handleAgentExport = async () => {
    const manager = new MemoryManager([]);
    const json = await manager.exportMemories();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-memories-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAgentImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const manager = new MemoryManager([]);
        const count = await manager.importMemories(ev.target?.result as string);
        await loadAgentMemories();
        setAgentImportStatus(t('memory.importSuccess').replace('{count}', String(count)));
        setTimeout(() => setAgentImportStatus(''), 3000);
      } catch {
        setAgentImportStatus(t('memory.importError').replace('{error}', 'Parse error'));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const loadMemoryCount = async () => {
    try {
      const memoryService = MemoryService.getInstance();
      await memoryService.init();
      const memories = await memoryService.getAllMemories();
      setMemoryCount(memories.length);
    } catch (error) {
      console.error('Error loading memory count:', error);
    }
  };

  const handleExportMemories = async () => {
    try {
      setExportStatus(t('memory.exporting'));
      const memoryService = MemoryService.getInstance();
      await memoryService.init();
      const memories = await memoryService.getAllMemories();

      const jsonData = JSON.stringify(memories, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const date = new Date().toISOString().split('T')[0];
      const filename = `infinit-agent-memories-${date}.json`;

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportStatus(t('memory.exportSuccess', { count: String(memories.length) }));
      setTimeout(() => setExportStatus(''), 3000);
    } catch (error) {
      setExportStatus(t('memory.exportError', { error: error instanceof Error ? error.message : String(error) }));
    }
  };

  const handleImportMemories = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setImportStatus(t('memory.importing'));

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const memories = JSON.parse(content);

          if (!Array.isArray(memories)) {
            throw new Error(t('memory.invalidFormat'));
          }

          const memoryService = MemoryService.getInstance();
          await memoryService.init();

          let importedCount = 0;
          for (const memory of memories) {
            if (!memory.domain || !memory.taskDescription || !memory.toolSequence) {
              console.warn('Skipping invalid memory:', memory);
              continue;
            }
            if (!memory.createdAt) memory.createdAt = Date.now();
            await memoryService.storeMemory(memory);
            importedCount++;
          }

          await loadMemoryCount();
          setImportStatus(t('memory.importSuccess', { count: String(importedCount) }));
          setTimeout(() => setImportStatus(''), 3000);

          if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (error) {
          setImportStatus(t('memory.parseError', { error: error instanceof Error ? error.message : String(error) }));
        }
      };

      reader.readAsText(file);
    } catch (error) {
      setImportStatus(t('memory.importError', { error: error instanceof Error ? error.message : String(error) }));
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  useEffect(() => {
    loadMemoryCount();
    loadAgentMemories();
  }, []);

  return (
    <>
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <h2 className="card-title text-xl">{t('memory.title')}</h2>
        <p className="mb-4">{t('memory.desc')}</p>

        <div className="flex items-center mb-4">
          <span className="font-medium mr-2">{t('memory.current')}</span>
          <span className="badge badge-primary">{memoryCount}</span>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleExportMemories}
            className="btn btn-primary"
            disabled={memoryCount === 0}
          >
            {t('memory.export')}
          </button>

          <button onClick={triggerFileInput} className="btn btn-secondary">
            {t('memory.import')}
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportMemories}
            accept=".json"
            className="hidden"
          />
        </div>

        {exportStatus && (
          <div className={`alert ${exportStatus.toLowerCase().includes('error') || exportStatus.toLowerCase().includes('errore') ? 'alert-error' : 'alert-success'} mt-4`}>
            {exportStatus}
          </div>
        )}

        {importStatus && (
          <div className={`alert ${importStatus.toLowerCase().includes('error') || importStatus.toLowerCase().includes('errore') ? 'alert-error' : 'alert-success'} mt-4`}>
            {importStatus}
          </div>
        )}
      </div>
    </div>

    {/* Agent memories (chrome.storage.local) */}
    <div className="card bg-base-100 shadow-md mt-4">
      <div className="card-body">
        <h2 className="card-title text-lg">{t('memory.agentTitle')}</h2>
        <div className="flex items-center gap-2 mb-3 text-sm">
          <span>{t('memory.validatedCount')
            .replace('{validated}', String(agentMemories.filter(m => m.validated).length))
            .replace('{total}', String(agentMemories.length))}</span>
        </div>
        <div className="flex gap-2 mb-3 flex-wrap">
          <button className="btn btn-sm btn-primary" onClick={handleAgentExport} disabled={agentMemories.length === 0}>
            {t('memory.export')}
          </button>
          <button className="btn btn-sm btn-secondary" onClick={() => agentImportRef.current?.click()}>
            {t('memory.import')}
          </button>
          <input ref={agentImportRef} type="file" accept=".json" className="hidden" onChange={handleAgentImport} />
        </div>
        {agentImportStatus && (
          <div className="alert alert-success text-sm mb-2">{agentImportStatus}</div>
        )}
        <div className="flex flex-col gap-1 max-h-64 overflow-auto" data-testid="agent-memory-list">
          {agentMemories.length === 0 && (
            <p className="text-sm text-gray-500">{t('memory.empty')}</p>
          )}
          {agentMemories.map(m => (
            <div key={m.id} className="flex items-center gap-2 bg-base-200 rounded px-2 py-1 text-xs" data-testid={`agent-memory-${m.id}`}>
              <span className="flex-1 truncate" title={m.pattern}>{m.domain} — {m.pattern}</span>
              <span className="text-gray-400 shrink-0">×{m.useCount}</span>
              {m.validated ? (
                <span className="badge badge-success badge-xs shrink-0">{t('memory.validated')}</span>
              ) : (
                <button
                  className="btn btn-xs btn-outline shrink-0"
                  onClick={() => handleValidate(m.id)}
                  data-testid={`btn-validate-${m.id}`}
                >
                  {t('memory.validate')}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
