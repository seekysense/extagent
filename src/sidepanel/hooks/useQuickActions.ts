interface UseQuickActionsProps {
  executePrompt: (prompt: string) => Promise<void>;
}

export function useQuickActions({ executePrompt }: UseQuickActionsProps) {
  const startSmartPaste = async (text: string): Promise<void> => {
    const prompt =
      `Leggi i campi compilabili di questa pagina. ` +
      `Poi, dato il seguente testo: "${text}", ` +
      `cerca di associare le informazioni ai campi e compilali. ` +
      `Usa il tool fill_form_from_data.`;
    await executePrompt(prompt);
  };

  const analyzePageForExtraction = async (): Promise<void> => {
    const prompt =
      `Analizza la pagina corrente con browser_accessible_tree. ` +
      `Identifica i dati estraibili (tabelle, liste, record strutturati). ` +
      `Indica: tipo di dati, colonne/campi rilevati, se c'è paginazione, formato consigliato (JSON o CSV). ` +
      `Solo analisi, non estrarre ancora.`;
    await executePrompt(prompt);
  };

  const startSmartExtract = async (hint: string, format: string, paginate: boolean): Promise<void> => {
    const tool = paginate ? 'paginate_and_collect' : 'extract_with_schema';
    const prompt =
      `Estrai i dati dalla pagina usando ${tool}. ` +
      `Formato richiesto: ${format}.` +
      (hint ? ` Nota aggiuntiva: ${hint}` : '');
    await executePrompt(prompt);
  };

  return { startSmartPaste, analyzePageForExtraction, startSmartExtract };
}
