import React, { useState } from 'react';
import { isHomogeneousArray } from '../../utils/csvExport';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      className="absolute top-1 right-1 btn btn-xs btn-ghost opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={handleCopy}
      title="Copia"
    >
      {copied ? '✓' : '⎘'}
    </button>
  );
}

const MAX_ROWS = 500;

interface ResultDisplayProps {
  result: unknown;
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  if (isHomogeneousArray(result)) {
    const rows = result as Record<string, unknown>[];
    const headers = Object.keys(rows[0]);
    const visible = rows.slice(0, MAX_ROWS);

    return (
      <div className="overflow-auto max-h-64 mt-2" data-testid="result-table">
        <table className="table table-xs w-full">
          <thead>
            <tr>
              {headers.map(h => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, i) => (
              <tr key={i}>
                {headers.map(h => <td key={h}>{String(row[h] ?? '')}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length > MAX_ROWS && (
          <p className="text-xs text-gray-400 mt-1">{rows.length - MAX_ROWS} more rows not shown</p>
        )}
      </div>
    );
  }

  const json = JSON.stringify(result, null, 2);
  return (
    <div className="relative mt-2 group">
      <pre
        className="text-xs bg-base-200 p-2 pr-8 rounded overflow-auto max-h-64 whitespace-pre-wrap"
        data-testid="result-json"
      >
        {json}
      </pre>
      <CopyButton text={json} />
    </div>
  );
}
