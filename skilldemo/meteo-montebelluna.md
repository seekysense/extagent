# Meteo Montebelluna — Oggi e domani

## Descrizione
Controlla il meteo di oggi e domani a Montebelluna. Se non piove, pubblica una news su backoffice.h4h.it. Se piove, cerca cosa fare a Montebelluna quando piove.

## Passi

1. Naviga la pagina meteo di oggi
   - `browser_navigate: https://www.3bmeteo.com/meteo/montebelluna`

2. Osserva la tabella del meteo del giorno corrente usando browser_accessible_tree o browser_screenshot
   - Cerca nella tabella oraria se compare la parola "pioggia", "piogge", "temporale", "rovescio" o simboli di pioggia
   - Memorizza il risultato: `oggi_piove = true/false`

3. Naviga la pagina meteo di domani
   - `browser_navigate: https://www.3bmeteo.com/meteo/montebelluna/1`

4. Osserva la tabella del meteo del giorno seguente
   - Cerca nella tabella oraria se compare la parola "pioggia", "piogge", "temporale", "rovescio" o simboli di pioggia
   - Memorizza il risultato: `domani_piove = true/false`

5. **Caso A — Non piove né oggi né domani** (`oggi_piove = false` AND `domani_piove = false`):

   5a. Naviga la pagina delle news
       - `browser_navigate: https://backoffice.h4h.it/contents/news`

   5b. Clicca sul pulsante "Nuova news" (o equivalente per creare un nuovo contenuto)

   5c `fill: Location=The Castelletto | Categoria=Proposte all'aperto| Titolo=Splende il sole oggi e domani | Descrizione=Ci attendono due giorni fantastici! [inserisci qui un breve consiglio su come trascorrere il tempo all'aperto a Montebelluna: scegli tra una passeggiata nel centro storico, un giro in bicicletta lungo il Montello o sui colli trevigiani]`

   5d. Clicca il pulsante "Salva"

6. **Caso B — Piove oggi o domani** (`oggi_piove = true` OR `domani_piove = true`):

   6a. Naviga la pagina delle news
       - `browser_navigate: https://backoffice.h4h.it/contents/news`

   6b. Clicca sul pulsante "Nuova news" (o equivalente per creare un nuovo contenuto)

   6c. `fill: Location=The Castelletto | Categoria=Alert Meteo | Titolo=Attenzione al temporale | Descrizione=Ci sarà pioggia  [inserisci qui un breve consiglio su come trascorrere il tempo al coiperto a Montebelluna (scegli tra una degustazione di vini o una visita al museo civico)]`

   6d. Clicca il pulsante "Salva"

## Note
- Per rilevare la pioggia nella tabella 3bmeteo, controlla sia il testo delle celle (es. "Pioggia debole", "Rovesci") sia eventuali attributi alt delle icone meteo
- Sul backoffice h4h, se è richiesto login, procedi con le credenziali disponibili nel contesto della sessione
- Il consiglio outdoor deve essere breve (1-2 frasi), naturale e adatto alla zona pedemontana del Montello
