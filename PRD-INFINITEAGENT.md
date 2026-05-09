# PRD — InfinitAgent

**Versione:** 0.1 (MVP)
**Data:** Maggio 2026
**Owner:** Andrea — Strategicamente SRL / Infinite Area
**Repository base:** Fork di [parsaghaffari/browserbee](https://github.com/parsaghaffari/browserbee) (Apache 2.0)

---

## 1. Sintesi esecutiva

InfinitAgent è un'estensione Chrome che porta un agente AI direttamente nel browser dell'operatore, con l'obiettivo specifico di **estrarre informazioni strutturate da portali aziendali** (gestionali web, portali fornitori, portali della Pubblica Amministrazione, intranet aziendali) e di eseguire **piccole automazioni correlate** alle estrazioni (compilazione campi, navigazione tra schermate, raccolta multi-pagina).


A differenza dei browser-agent generalisti già sul mercato (Comet, Atlas, Claude for Chrome), InfinitAgent è progettato attorno a tre vincoli precisi:

1. **Sovranità del dato:** il modello LLM gira on-premise o in cloud privato del cliente, esposto via endpoint OpenAI-compatibile. Nessuna chiamata verso provider terzi.
2. **Modello locale di taglia media (Qwen3 35B, 32k token di contesto):** l'intera architettura è ottimizzata per un modello meno capace dei frontier model commerciali, compensando con tool atomici, schemi di estrazione predefiniti e memorizzazione di pattern ricorrenti. E' esposto in standard OpenAI ma ha dei parametri estensivi sul header per attivare o meno il reasoning. 
3. **Domini prevedibili (B2B, gestionali interni):** il prodotto non punta a "controllare il web in linguaggio naturale", ma a operare in modo affidabile su un insieme limitato di portali noti al cliente.

L'MVP nasce come **fork brandizzato di BrowserBee**, sfruttandone l'architettura modulare già matura, e aggiungendo le componenti specifiche per estrazione strutturata schema-driven e per l'integrazione robusta con backend Qwen3.

## 2. Obiettivi del MVP

### 2.1 Obiettivi primari

- Estrarre dati strutturati da una pagina web seguendo uno schema JSON fornito dall'operatore o predefinito per dominio.
- Riassumere e classificare contenuti testuali presenti in pagina (email web, post in bacheche aziendali, comunicazioni interne).
- Eseguire piccole automazioni multi-step: navigazione tra liste e schede di dettaglio, raccolta paginata, compilazione di campi a partire da dati strutturati.
- Operare interamente con un modello LLM esposto via endpoint OpenAI-compatibile, configurabile dall'operatore (URL base, API key, nome modello).

Deve Avere bottoni per pannelli rapidi:
 - Smart Paste: c'è un'area di testo dove si incollano delle informazioni full text e l'agente cerca di compilare la pagina con esse. Legge i campi compilabili (text, text area, combo, check box e combobox) quindi cerca di associare le informazioni relative a quelle incollate nella area di testo e compila.
 - Smart Extract: legge la pagina, trova elementi, elenchi o tabelle. Propone cosa estrarre e formato di output (file excel, jason, csv), capisce se c'è un multipagina da mandare avanti o parametri di filtro di cui tenere conto.
 - Automate: registra la sequenza fatta dall'utente sul browser, click e testo, acquisisce gli snapshot per capire cosa è successo. Quindi l'utente con un prompt da i comandi di replica dell'operazione. Chidede conferma prima di proseguire.
 La registrazione avrà un nome riconosciuto come tool richiamabile nelle skill.
 

### 2.2 Obiettivi non funzionali

- Privacy by design: nessun dato della pagina o della conversazione esce dal browser dell'utente, eccetto verso l'endpoint LLM configurato.
- Trasparenza operativa: l'operatore vede in tempo reale ogni tool che l'agente sta usando, prima e dopo l'esecuzione, con possibilità di interrompere.
- Approval esplicito per azioni a effetto laterale (invio form, pubblicazione, modifica record).
- Funzionamento integrale offline (rispetto al cloud pubblico) quando l'endpoint LLM è raggiungibile in rete locale.
- Supporto a provider non OpenAI-compatibili (Anthropic, Gemini, Ollama nativo, ecc.). Tutti i provider preesistenti in BrowserBee verranno **rimossi** dal codice per ridurre superficie e dipendenze. Nella configurazione di end point OpenAi deve poter essere messo i due parametri per determinare se il reasoning è attivato e disattivato (due texbox, default:)
- Archivio di skill.md editabile, archiviate per titolo e hanno descrizione,  e richiamabili, sono skill che possono contenere sequenze di operazioni da eseguire (avendo dentro i tool richiamabili extract - navigate - play automate:name).  I file saranno salvati in locale sul pc dell'operatore. Queste devono servire per gestire "micro progetti" che l'operatore vuole implementare (es. "raccolta dei dati di gare di appalto", "estrazione biografie da linkedin")

### 2.3 Fuori scope per l'MVP


- Esecuzione di task pianificati o ricorrenti (cron-like).
- Multi-utente / centralizzazione configurazioni via Chrome Enterprise policies (rimandato a release successive).
- Pubblicazione su Chrome Web Store (l'MVP sarà distribuito come unpacked extension o `.zip` ai clienti pilota).
- Mobile / Android.
- Ottimizzazione per pagine fortemente JavaScript-driven con rendering ritardato (single-page app complesse). Saranno gestite best-effort.

## 3. Utenti target e use case

### 3.1 Persona primaria

**Operatore amministrativo o tecnico in PMI manifatturiera/servizi**, abituato a usare quotidianamente uno o più portali web aziendali per attività ripetitive di consultazione e data entry. Non è un utente tecnico avanzato; conosce il dominio applicativo del proprio gestionale ma non sa scrivere selettori CSS.

### 3.2 Persona secondaria

**IT manager / consulente che configura InfinitAgent per i propri colleghi.** Definisce gli schemi di estrazione per i portali ricorrenti, configura l'endpoint LLM aziendale, distribuisce l'estensione, distribuisce skill e registrazioni di sequenze che devono poter essere caricate.

### 3.3 Use case di riferimento per l'MVP

1. **Estrazione anagrafica fornitori da gestionale web:** l'operatore apre la lista fornitori, chiede a InfinitAgent di estrarre nome, P.IVA, condizioni di pagamento e contatto principale di tutti i fornitori della pagina corrente, in formato CSV o JSON.
2. **Raccolta dati ordini multi-pagina:** dato un elenco paginato di ordini, InfinitAgent itera sulle pagine e raccoglie i dati di intestazione di ogni ordine secondo schema.
3. **Riassunto bacheca aziendale / Outlook web:** l'operatore chiede a InfinitAgent di leggere la posta in arrivo o una bacheca interna e produrre una sintesi tematica delle ultime N comunicazioni.
4. **Estrazione schede di dettaglio:** dato un ID record o una lista di link a pagine di dettaglio, InfinitAgent visita ciascuna scheda e raccoglie i campi specificati.
5. **Compilazione assistita di form:** dato un payload strutturato (es. dati di una commessa esportata da altro sistema), InfinitAgent compila i campi del form di destinazione richiedendo conferma operatore prima del submit.

## 4. Architettura

### 4.1 Eredità da BrowserBee

L'MVP riusa, salvo esplicita modifica, l'architettura modulare di BrowserBee:

- **Manifest V3** con service worker, content script e side panel.
- **Playwright in-browser via playwright-crx** per controllo robusto delle pagine via Chrome DevTools Protocol.
- **Agent core modulare:** `AgentCore`, `ExecutionEngine`, `ToolManager`, `PromptManager`, `MemoryManager`, `TokenManager`, `ErrorHandler`, `approvalManager`.
- **Side panel React** con `MessageDisplay`, `PromptForm`, `TabStatusBar`, `TokenUsageDisplay`.
- **IndexedDB** per memoria persistente di pattern di tool use efficaci per dominio.
- **Tool catalog browser:** navigation, interaction, observation, mouse, keyboard, tab, memory.

### 4.2 Modifiche architetturali specifiche di InfinitAgent

- **Provider unico OpenAI-compatibile.** I moduli `models/providers/anthropic.ts`, `gemini.ts`, `ollama.ts` e `ollama-format.ts` vengono rimossi. La factory `models/providers/factory.ts` viene semplificata. Il provider `openai.ts` viene mantenuto e generalizzato a "openai-compatible" con base URL, API key e nome modello configurabili.
- **Token manager riconfigurato per finestre piccole.** Il `TokenManager` esistente viene tarato sul vincolo dei 32k token: trimming più aggressivo della history, summarizer intermedio quando la cronologia supera una soglia, troncamento adattivo delle osservazioni DOM in base al budget residuo.
- **Schema-driven extraction tool.** Nuovo tool `extract_with_schema(json_schema)` nella categoria observation, che esegue preprocessing del DOM (rimozione script/style, riduzione ad accessibility tree o markdown), invia al modello con prompt forzato a output JSON valido, e fa post-validazione contro lo schema.
- **Domain profiles.** Configurazione opzionale per dominio (`*.miogestionale.it`) con: schema di estrazione predefinito, hint sui selettori prevalenti, system prompt aggiuntivo specifico, eventuali memorie pre-popolate.
- **Italianizzazione completa** di UI, system prompt, tool descriptions e messaggi di errore.
- **Rebranding completo** da BrowserBee a InfinitAgent.

### 4.3 Flusso operativo

1. L'operatore apre il side panel di InfinitAgent (icona barra strumenti o shortcut).
2. InfinitAgent attacca via CDP la tab corrente.
3. L'operatore impartisce un'istruzione in linguaggio naturale italiano (es. "estrai tutti i fornitori di questa lista in CSV con nome, P.IVA e città").
4. L'`ExecutionEngine` invia istruzione + system prompt al backend Qwen3 via endpoint OpenAI-compatibile.
5. Il modello restituisce una sequenza di tool call. InfinitAgent li esegue uno per volta, mostrando ogni passo nel side panel.
6. Per azioni a effetto laterale (submit, navigazione fuori dominio, modifica record) InfinitAgent richiede approvazione esplicita.
7. A fine task, InfinitAgent presenta il risultato strutturato e offre export (clipboard, CSV, JSON).
8. Se il task ha avuto successo e si tratta di un pattern ripetibile, l'agente propone di salvare la sequenza in memoria locale per riuso futuro sullo stesso dominio.

## 5. Requisiti funzionali

### 5.1 Configurazione provider LLM

- L'options page espone un singolo blocco "LLM Endpoint" con i campi: Base URL, API Key (opzionale), Model name, Context window size (default 32000), temperature, max tokens per risposta.
- InfinitAgent valida la connessione con una chiamata di test al momento del salvataggio.
- I valori sono persistiti in `chrome.storage.local`.
- Nessun riferimento UI ad altri provider.

### 5.2 Side panel

- Apertura via icona toolbar o shortcut Alt+Shift+E (rebrand da Alt+Shift+B).
- Campo prompt con cronologia interna del task corrente.
- Visualizzazione step-by-step dei tool call con: nome tool, parametri, output sintetico, screenshot opzionale.
- Pulsante "Stop" sempre disponibile durante l'esecuzione.
- Pulsante "Reattach tab" per recupero attaccamento CDP.
- Indicatore stato: idle / thinking / executing tool / waiting approval.
- Display token usage (input/output) e costo se configurato un pricing per il modello (per Qwen locale tipicamente zero, ma utile per varianti hosted).

### 5.3 Tool di base (ereditati e adattati)

I tool browser di BrowserBee sono mantenuti, con descrizioni riscritte in italiano e leggermente semplificate per ridurre token in system prompt:

- Navigazione: `browser_navigate`, `browser_navigate_back`, `browser_navigate_forward`, `browser_wait_for_navigation`.
- Interazione: `browser_click`, `browser_type`, `browser_handle_dialog`.
- Osservazione: `browser_get_title`, `browser_snapshot_dom`, `browser_query`, `browser_accessible_tree`, `browser_read_text`, `browser_screenshot`.
- Tab: `browser_tab_list`, `browser_tab_new`, `browser_tab_select`, `browser_tab_close`, `browser_get_active_tab`.
- Memoria: `save_memory`, `lookup_memories`, `get_all_memories`, `delete_memory`.

I tool mouse e keyboard a coordinate assolute (`browser_click_xy`, `browser_drag`, `browser_move_mouse`) sono mantenuti ma deprioritizzati nel system prompt: sui portali aziendali target il selettore CSS o il testo sono quasi sempre preferibili.

### 5.4 Tool nuovi specifici di InfinitAgent

- **`extract_with_schema`**: input = JSON Schema, output = JSON conforme. Internamente: snapshot DOM ridotto, costruzione di un prompt di estrazione mirato, invocazione del modello con `response_format` JSON quando supportato dall'endpoint, validazione contro lo schema, retry con feedback in caso di violazione (max 2 tentativi).
- **`paginate_and_collect`**: input = selettore CSS del bottone "pagina successiva" (o testo del link), schema, numero massimo di pagine. L'agente itera, applica `extract_with_schema` su ogni pagina, accumula i risultati e li deduplica.
- **`fill_form_from_data`**: input = mapping campo→valore. L'agente individua i campi (per label, placeholder, name) e li compila, fermandosi prima del submit per chiedere approvazione.
- **record automation**
- **play automation**
- **use skill**

### 5.5 Domain profiles

- File JSON in `chrome.storage.local` con array di profili `{ domain_pattern, display_name, default_schema, system_prompt_addendum, hints }`.
- Quando l'operatore avvia un task su una tab il cui URL matcha un pattern, il profilo viene caricato e il system prompt viene esteso con le sue indicazioni.
- L'options page espone un editor JSON elementare per creare/modificare profili. Editor visuale rimandato a release successive.

### 5.6 Approval manager

Riusa il modulo esistente. Le azioni che richiedono approvazione esplicita per InfinitAgent sono:

- Click su elementi `type=submit`, `<button>` con testo che matcha pattern di submit (Invia, Conferma, Salva, Submit, Send).
- Navigazione verso domini diversi da quello iniziale del task.
- Esecuzione di `fill_form_from_data` (sempre approval prima del submit, mai del solo riempimento).
- Cancellazioni o eliminazioni rilevate da pattern testuali (Elimina, Cancella, Rimuovi).

### 5.7 Output ed export

- Risultati di estrazione visualizzati in side panel come tabella se array di oggetti omogenei, altrimenti come JSON formattato.
- Pulsanti: "Copia JSON", "Esporta CSV", "Copia tabella". Il CSV è generato client-side senza dipendenze esterne.
- Cronologia task della sessione corrente visibile e ri-eseguibile (rerun).

### 5.8 Memoria

Riusa `MemoryManager` di BrowserBee. Modifiche:

- Memoria di default attiva.
- L'operatore può marcare una memoria come "validata" per forzarla in alto nel ranking di lookup.
- Funzione di export/import del database memorie come JSON, per condivisione tra colleghi nello stesso ambiente aziendale.
nuove features:
- gestione skill md
- gestione registrazioni

## 6. Requisiti non funzionali

### 6.1 Performance

- Apertura side panel < 500 ms.
- Primo token di risposta < 3 s su tipico task di estrazione (assumendo Qwen3 35B su hardware adeguato in LAN).
- Estrazione di una pagina con 20 record secondo schema completata in < 30 s.
- Consumo memoria estensione < 200 MB in stato idle.

### 6.2 Privacy e sicurezza

- Nessuna telemetria. Nessuna chiamata in uscita verso domini diversi dall'endpoint LLM configurato.
- API key memorizzata in `chrome.storage.local` (non sincronizzata via Google).
- Su pagine `chrome://`, `chrome-extension://` e tab senza URL, l'estensione si rifiuta di operare con messaggio chiaro.
- I content script non iniettano codice persistente nelle pagine target.
- Le memorie salvate in IndexedDB non contengono mai contenuto della pagina, solo descrizioni di sequenze di tool e selettori.

### 6.3 Affidabilità

- Loop agentico con limite massimo di step per task (default 25, configurabile) per prevenire loop.
- Timeout per singolo tool call (default 30 s, navigazione 60 s).
- Auto-recovery in caso di disconnessione CDP con pulsante "Reattach".
- Gestione esplicita di errori dell'endpoint LLM (timeout, 4xx, 5xx) con messaggi italiani comprensibili.
- gestione errore 500 da LLM , significa che si è andati oltre la token window, quindi nel caso si siano passate immagini vanno ridimensionate se si è passato un testo della pagina va sanificato e ridotto al minimo.

### 6.4 Compatibilità

- Chrome stabile 120+ e Edge stabile 120+.
- Endpoint LLM compatibili con `/v1/chat/completions` di OpenAI, con supporto a tool/function calling. Testato in primis con Qwen3 35B servito via vLLM e via llama.cpp con OpenAI server. Compatibilità con altri server (Ollama in modalità OpenAI-compat, LM Studio, TGI) come effetto collaterale, non garantita.

## 7. Piano operativo: dal fork all'MVP

L'attività si articola in sei fasi sequenziali con qualche sovrapposizione opportunistica. La stima totale è di 4-6 settimane uomo per uno sviluppatore full-time esperto, o equivalente part-time su periodo più lungo.

### Fase 0 — Setup e bootstrap (2-3 giorni)

1. Fork del repository `parsaghaffari/browserbee` su GitHub privato dell'organizzazione, rinominato `InfinitAgent`.
2. Aggiornamento `LICENSE` mantenendo Apache 2.0 e aggiungendo file `NOTICE` con attribuzione all'autore originale.
3. `npm install`, `npm run build`, caricamento unpacked in Chrome dev. Verifica funzionamento end-to-end usando temporaneamente OpenAI ufficiale (per validare baseline).
4. Configurazione endpoint Qwen3 35B di sviluppo (vLLM o llama.cpp con OpenAI server). Verifica CORS abilitato.
5. Primo test end-to-end con Qwen3 sul provider OpenAI-compatibile esistente. Identificazione dei punti di rottura più evidenti (formato tool call, lingua delle risposte, errori di parsing).

### Fase 1 — Sfoltimento e rebranding (1 settimana)

**Sfoltimento codice:**

1. Rimozione fisica dei file `models/providers/anthropic.ts`, `gemini.ts`, `ollama.ts`, `ollama-format.ts`.
2. Rimozione delle componenti UI options corrispondenti: `AnthropicSettings.tsx`, `GeminiSettings.tsx`, `OllamaSettings.tsx`, `OllamaModelList.tsx`.
3. Semplificazione di `ProviderSelector.tsx`: rimossa la scelta multipla, resta solo la configurazione OpenAI-compatibile come unica opzione.
4. Generalizzazione di `OpenAICompatibleSettings.tsx` come unica schermata di configurazione, con validazione connessione.
5. Aggiornamento `factory.ts` perché restituisca sempre il provider openai-compatibile.
6. Pulizia di `package.json` da dipendenze legate ai provider rimossi (`@anthropic-ai/sdk`, `@google/generative-ai`, libreria Ollama browser).

**Rebranding:**

7. Sostituzione di tutte le occorrenze di "BrowserBee" / "browserbee" / "🐝" in: `manifest.json` (name, description, action title, commands), `package.json`, README, file di codice, label UI.
8. Nuovo set di icone (16, 32, 48, 128 px) per InfinitAgent. Iconografia suggerita: lente di ingrandimento + simbolo schema/tabella, o un'ape stilizzata reinterpretata se si vuole mantenere continuità visiva.
9. Aggiornamento del nome shortcut: Alt+Shift+E.
10. Riscrittura di README e ARCHITECTURE.md per riflettere il nuovo focus, mantenendo nei credits l'attribuzione a BrowserBee e a Cline.
11. Aggiornamento manifest del side panel, options page, descrizioni Chrome.
12. Verifica build pulita e caricamento in Chrome con nuova identità.

Ne front end deve essere tolto: il motore utilizzato, il numero di token utilizzati, deve essere chiaro se l'agente sta operando (il Qwen locale ha 40 token al secondo circa, quindi potrebbe essere lento!! anche a livello di timeout sii prudente.) Il pannello di chat deve essere pulito e minimale.


**Italianizzazione (avvio):**

13. Traduzione delle stringhe UI principali del side panel e options. La traduzione completa di system prompt e tool descriptions è coperta in Fase 3.  Deve essere gestita sia lingua inglese che italiano.

### Fase 2 — Adattamento agente per Qwen3 35B / 32k contesto (1-2 settimane)

Questa è la fase tecnicamente più delicata. Il successo o l'insuccesso del MVP si gioca qui.

1. **Analisi baseline:** esecuzione di una batteria di task tipo (10-15 task rappresentativi su pagine reali — meglio se su gestionali messi a disposizione dei clienti pilota, altrimenti su mock locali) con il system prompt originale di BrowserBee usato con Qwen3. Registrazione fallimenti: tool call malformati, allucinazioni di selettori, loop, esaurimento contesto, output in inglese, ecc.
2. **Riscrittura del PromptManager:**
   - System prompt più conciso, scritto in italiano (ma configurabile in inglese nel setup), con esempi di chain-of-thought brevi e in italiano. (gestione della doppia lingua, quindi i system prompt devono essere editabili da configurazione)
   - Tool descriptions accorciate del 40-60% rispetto agli originali, mantenendo solo l'essenziale e privilegiando esempi a parole.
   - Istruzione esplicita a usare lookup_memories come primo step su un dominio noto.
   - Istruzione esplicita a usare `browser_accessible_tree` o `browser_read_text` (ad alta densità informativa) prima di `browser_snapshot_dom` (verboso).
3. **Riscrittura di TokenManager:**
   - Soglia di trimming history portata a circa 22-24k token (lasciando margine per system prompt + ultima osservazione + risposta).
   - Summarizer intermedio: quando la history viene tagliata, il chunk rimosso viene riassunto da una chiamata extra al modello e il riassunto resta in cronologia.
   - Troncamento adattivo delle osservazioni DOM: il budget per la prossima osservazione viene calcolato dinamicamente.
4. **Test iterativo:** ripetizione della batteria di task dopo ogni round di modifiche. Obiettivo MVP: tasso di successo ≥ 70% sui task di estrazione strutturata, ≥ 60% sui task di navigazione multi-step.
5. **Configurazione tool calling:** verifica che il formato di tool call usato dall'endpoint Qwen3 sia correttamente parsato dall'`ExecutionEngine`. Patch dove necessario.

### Fase 3 — Tool nuovi specifici di InfinitAgent (1 settimana)

1. Implementazione di `extract_with_schema` come tool dell'agente. Logica:
   - Snapshot DOM filtrato (rimozione script, style, attributi rumorosi tipo `data-react-*`).
   - Conversione opzionale a markdown via libreria minimale (es. turndown) o ad accessibility tree.
   - Costruzione di un prompt di estrazione interno mirato, con lo schema target serializzato e istruzioni di output JSON puro.
   - Chiamata al modello con `response_format` JSON object se supportato; altrimenti parsing tollerante con fallback regex.
   - Validazione contro lo schema con `ajv`. In caso di violazione, retry con messaggio di errore in pasto al modello (max 2 retry).
2. Implementazione di `paginate_and_collect` come tool composito. Internamente esegue un loop controllato che chiama `extract_with_schema` su ogni pagina, individua il bottone successivo, gestisce il caso "ultima pagina" con euristica (bottone disabilitato, scomparsa, conteggio risultati invariato).
3. Implementazione di `fill_form_from_data`. Logica di matching campo-valore: prima per `name`/`id` esatto, poi per label associata via `for`, poi per testo prossimale. Fermarsi prima del submit, restituire all'agente l'elenco dei campi compilati e di quelli non matchati.
4. Aggiunta dei tre tool al `ToolManager` con descrizioni italiane. Aggiornamento del system prompt per istruire il modello a preferire questi tool ai loro equivalenti più atomici quando applicabile.

### Fase 4 — Domain profiles e UX di supporto (4-5 giorni)

1. Schema dei domain profile in `chrome.storage.local`.
2. Logica di matching domain pattern (semplice glob, niente regex per ridurre rischi di errori utente).
3. Editor JSON nella options page con validazione sintattica e schema-validation.
4. Caricamento automatico del profilo al momento dell'attacco a una tab matching.
5. Indicatore in side panel del profilo attivo.
6. Esportazione e importazione profili come JSON.
7. UX dell'output:
   - Rendering tabellare automatico quando il risultato è un array di oggetti.
   - Pulsanti Copia JSON / Esporta CSV / Copia tabella.
   - Cronologia task della sessione e funzione "Riesegui task".

### Fase 5 — Italianizzazione completa (a scelta si può usare anche in inglese), testing, hardening (1-2 settimane)

1. Completamento traduzione di system prompt, tool descriptions, error messages, tooltip UI, oggetti del flusso di approval (di default, ma si possono riportare in inglese nelle configurazioni)
2. Suite di test end-to-end semi-automatica:
   - Mock di portali aziendali realistici (HTML statici riproducibili in cartella `tests/fixtures/`).
   - Script che apre Chrome con estensione caricata, esegue una sequenza fissa di prompt, raccoglie i risultati e li confronta con expected output.
   - Almeno 15 test case che coprono i 5 use case di riferimento.
3. Stress test sul vincolo di contesto: task lunghi che forzano trimming, verificare che il summarizer non perda informazioni critiche.
4. Test su pagine reali fornite dai clienti pilota (sotto NDA), con loro presenza per validazione qualitativa.
5. Hardening:
   - Limiti di rate sulle chiamate al modello (configurabile).
   - Gestione robusta di disconnessione CDP, refresh tab durante task, chiusura tab.
   - Messaggi di errore comprensibili in italiano per tutti i percorsi di errore.
6. Pacchetto distribuibile: build di produzione, zip dell'extension, istruzioni di installazione unpacked per i pilot.

### Fase 6 — Pilot e iterazione (in continuo, post-MVP)

1. Distribuzione a 2-3 clienti pilota selezionati tra quelli con esigenze più aderenti agli use case di riferimento.
2. Sessione di onboarding di un'ora con definizione di 1-2 domain profile insieme al cliente.
3. Raccolta feedback strutturata dopo 2 settimane di uso reale.
4. Iterazione su prompt, tool e schemi di default in base al feedback.

## 8. Rischi e mitigazioni

| Rischio | Probabilità | Impatto | Mitigazione |
|---|---|---|---|
| Qwen3 35B insufficientemente affidabile su tool calling complesso | Media | Alto | Fase 2 ampiamente bufferizzata. Fallback verso modello più grande (Qwen3 più grande in 4-bit) come piano B. Tool nuovi schema-driven riducono complessità del loop agentico. |
| Contesto 32k troppo stretto per pagine HTML reali | Alta | Medio | Preprocessing aggressivo del DOM, accessibility tree come default, summarizer intermedio. Schema-driven extraction riduce drasticamente il bisogno di tener tutto il DOM in contesto. |
| Selettori CSS allucinati dal modello | Alta | Medio | Privilegiare interazione per testo / label rispetto a selettori. Memoria di pattern validati. Eventuale set-of-marks (deferito). |
| Drift di playwright-crx (progetto comunitario) | Bassa | Medio | Pinnare versione. Documentare la dipendenza nel NOTICE. Valutare in seguito CDP diretto come alternativa. |
| BrowserBee abbandonato: bug dormienti emergono in prod | Media | Medio | Test suite propria sin dall'inizio. Disponibilità a investire 1-2 giorni/mese di manutenzione. |
| Cliente pilota usa portale con pesante anti-bot / WAF | Bassa | Alto | Verificare in fase di onboarding. Documentare incompatibilità note. InfinitAgent opera in tab dell'utente loggato, riducendo trigger anti-bot, ma non li elimina. |
| Endpoint Qwen3 instabile in cliente | Media | Medio | Validazione connessione robusta. Messaggi di errore espliciti. Documentare requisiti di deployment lato Infinite Area. |

## 9. Metriche di successo dell'MVP

- **Tasso di successo task di estrazione strutturata** su batteria interna: ≥ 70%.
- **Tasso di successo navigazione multi-step** su batteria interna: ≥ 60%.
- **Tempo medio task di estrazione** su pagina con 20 record: ≤ 30 s.
- **Numero di domain profile** configurati nei pilot: ≥ 1 per cliente entro 2 settimane.
- **Feedback qualitativo pilot:** almeno 2 clienti su 3 dichiarano disponibilità a continuare l'uso oltre il pilot.
- **Stabilità:** zero crash dell'estensione in 1 settimana di uso continuativo da parte di un pilot.

## 10. Dettagli finiali:

2. Iconografia InfinitAgent: niente ape , nuovo simbolo dell'infinito?
4. Gestione del licensing commerciale: InfinitAgent resta open-source forkato (Apache 2.0) o si introduce una versione enterprise chiusa? Decisione da prendere prima della distribuzione pilot per impostare correttamente i repository.
5. Strategia di update: come distribuire come zip

## 11. Crediti e attribuzioni

InfinitAgent è un fork derivato di BrowserBee di Parsa Ghaffari, distribuito sotto licenza Apache 2.0. BrowserBee a sua volta riconosce contributi da Cline, playwright-crx (Rui Figueira) e playwright-mcp (Microsoft). Tutte le attribuzioni saranno mantenute nel file `NOTICE` e nel README di InfinitAgent.
