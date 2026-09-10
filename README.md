# Traqspera — Intercompany Jobs

Prototype implementing the **Manage Intercompany Jobs** modal updates:

- Searchable **checkbox list** for jobs to copy (replaces multiselect pills)
- **Job type + department** filters with prefill aligned to **Delete Unused Jobs** defaults
- Already-copied jobs stay visible, **greyed out**, with **(copied)** appended
- **Save** updates the status table in-modal — no full page refresh

## Run locally

```bash
cd prototype
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`) and click **Manage Intercompany Jobs**.

## Live demo (GitHub Pages)

https://sarafarhat13.github.io/traqspera-intercompany/

Pushes to `main` deploy automatically via GitHub Actions.
