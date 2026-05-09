import { useState, useCallback } from 'react';

export interface TaskEntry {
  id: string;
  prompt: string;
  result?: unknown;
  timestamp: Date;
}

export function useTaskHistory() {
  const [history, setHistory] = useState<TaskEntry[]>([]);

  const addTask = useCallback((prompt: string, result?: unknown) => {
    setHistory(prev => [
      ...prev,
      { id: Date.now().toString(), prompt, result, timestamp: new Date() },
    ]);
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  const getHistory = useCallback((): TaskEntry[] => history, [history]);

  return { history, addTask, clearHistory, getHistory };
}
