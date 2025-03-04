# Progetto e sviluppo di un'app per la realizzazione di racconti interattivi

## 📝 Descrizione
**SnapTale** è un'applicazione web che permette di creare racconti interattivi attraverso un'interfaccia visuale. Gli utenti possono disporre delle card rappresentanti le pagine della storia e collegarle tra loro per costruire un racconto. Ogni pagina può includere un'immagine di sfondo e un file audio per arricchire l'esperienza.

Questo progetto si integra con un'iniziativa già esistente presso il laboratorio **[ISLab](https://islab.di.unimi.it)** dell'Università degli studi di Milano e include un sistema di gestione utenti, consentendo a ciascun utente di personalizzare profilo e racconti.

## ✨ Funzionalità principali
- 🎨 **Editor visuale interattivo**: utilizzo di ReactFlow per disporre e collegare le pagine del racconto su un canvas.
- 📄 **Gestione pagine**: ogni pagina del racconto può includere testo, un'immagine di sfondo e un file audio.
- 👤 **Sistema di utenze**: registrazione, autenticazione e gestione del profilo utente.
- 📚 **Gestione racconti**: creazione, modifica e visualizzazione delle proprie storie interattive.
- 🔗 **Integrazione con [ISLab](https://islab.di.unimi.it)**: compatibilità con il progetto esistente del laboratorio [ISLab](https://islab.di.unimi.it).

## 🛠️ Tecnologie utilizzate
- **Frontend**: TypeScript, React, ReactFlow, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: MongoDB 
- **Autenticazione**: JWT

### 📂 Installazione

- Clonare questa repository
  ```bash
  git clone https://github.com/daxdiv/app-racconti-interattivi.git
  ```
- Frontend
  ```bash
  cd frontend
  pnpm i # o npm i, or yarn
  touch .env # aggiungere variabili di ambiente come in .env.example
  pnpm run dev # npm run dev, yarn dev
  ```
- Backend
  ```bash
  cd backend
  pnpm i # o npm i, or yarn
  touch .env # aggiungere variabili di ambiente come in .env.example
  pnpm run dev # npm run dev, yarn dev
  ```
