# 📚 StudyFlow — Projektplan

## 🎯 Konzept

Eine Web-App wo du ein Thema eingibst, auf Start drückst, die Stoppuhr läuft, und alles automatisch als Session gespeichert wird. Nach der Session kannst du eine kurze Notiz schreiben. Statistiken zeigen dir deinen Fortschritt über Zeit.

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Vue 3 + Vite + Tailwind |
| UI Components | shadcn-vue oder PrimeVue |
| Backend | Express + Node.js |
| ORM | Drizzle ORM |
| Datenbank | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Hosting | Vercel (Frontend) + Railway (Backend) |

---

## 🗂️ Datenbankschema

### User
Wird von Supabase Auth verwaltet.
```
id, email, created_at
```

### Session
```
id             uuid, PK
user_id        uuid, FK → User
title          text         "React Hooks lernen"
started_at     timestamp    gesetzt beim Start
ended_at       timestamp    null solange aktiv
duration_secs  integer      berechnet beim Stoppen
note           text         optional, nach der Session
created_at     timestamp
```

### Tag *(Phase 2, optional)*
```
id, user_id, name
```

### SessionTag *(Phase 2, optional)*
```
session_id, tag_id
```

### Drizzle Schema

```typescript
// server/src/db/schema.ts

import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core'

export const sessions = pgTable('sessions', {
  id:           uuid('id').defaultRandom().primaryKey(),
  userId:       uuid('user_id').notNull(),
  title:        text('title').notNull(),
  startedAt:    timestamp('started_at').notNull().defaultNow(),
  endedAt:      timestamp('ended_at'),
  durationSecs: integer('duration_secs'),
  note:         text('note'),
  createdAt:    timestamp('created_at').notNull().defaultNow(),
})
```

---

## 🖥️ Frontend — Seiten & Komponenten

### Seiten
```
/                   → Landing / Login
/dashboard          → Übersicht + aktive Session
/session/new        → Timer + laufende Session
/session/:id        → Abgeschlossene Session (Notiz bearbeiten)
/stats              → Statistiken & Charts
/profile            → Account Settings
```

### Wichtigste Komponenten
- `StopwatchTimer.vue` — Herzstück, läuft in Echtzeit
- `SessionCard.vue` — Vergangene Sessions als Karte
- `NoteEditor.vue` — Textarea nach der Session
- `StatsChart.vue` — Chart.js oder ApexCharts

---

## ⚙️ Backend — API Endpoints (Express)

```
POST   /api/sessions/start     → Session anlegen, started_at setzen
POST   /api/sessions/:id/stop  → ended_at + duration speichern
PATCH  /api/sessions/:id/note  → Notiz hinzufügen
GET    /api/sessions           → Alle Sessions des Users
GET    /api/sessions/:id       → Eine Session
GET    /api/stats/summary      → Gesamtzeit, Streak, Top-Themen
```

> Alle Routes durch Supabase JWT Auth geschützt.

### Dependencies

```bash
# server
npm install drizzle-orm postgres express cors dotenv
npm install -D drizzle-kit @types/express typescript
```

---

## 📁 Repo Struktur

```
studyflow/
├── client/
│   ├── src/
│   │   ├── views/
│   │   ├── components/
│   │   ├── stores/        → Pinia
│   │   ├── composables/
│   │   └── router/
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── controllers/
│   │   └── db/
│   │       └── schema.ts
│   └── index.ts
└── README.md
```

---

## 🗺️ Roadmap

### Phase 1 — Foundation (Woche 1–2)
- [ ] Repo Setup (Monorepo: `/client` + `/server`)
- [ ] Supabase Projekt anlegen, Auth konfigurieren
- [ ] Drizzle Schema + Migrations
- [ ] Express Grundgerüst + Auth Middleware
- [ ] Vue 3 + Vite + Tailwind Setup
- [ ] Login / Register Seite

### Phase 2 — Core Feature (Woche 3–4)
- [ ] Stoppuhr Komponente (läuft auch bei Tab-Wechsel!)
- [ ] Session starten / stoppen / speichern
- [ ] Dashboard mit Session-Liste
- [ ] Notiz nach der Session

### Phase 3 — Stats + Polish (Woche 5–6)
- [ ] Statistiken: Gesamtzeit, Streak, Stunden pro Tag
- [ ] Charts einbauen
- [ ] Tags für Sessions (optional)
- [ ] UI verfeinern, Responsive

### Phase 4 — Deployment (Woche 7)
- [ ] Vercel (Frontend)
- [ ] Railway (Express Backend)
- [ ] Supabase (DB + Auth)
- [ ] Domain, ENV Variables, Testing

---

## ⚠️ Wichtige technische Herausforderungen

### Stoppuhr bei Tab-Wechsel
`started_at` in DB speichern, Zeit clientseitig aus dem Timestamp berechnen — niemals nur lokalen State nutzen.

```typescript
// composables/useStopwatch.ts
const elapsed = computed(() => {
  if (!session.startedAt) return 0
  return Math.floor((Date.now() - new Date(session.startedAt).getTime()) / 1000)
})
```

### Auth Middleware (Express)
Supabase JWT in jedem Request validieren.

```typescript
// middleware/auth.ts
import { createClient } from '@supabase/supabase-js'

export async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return res.status(401).json({ error: 'Unauthorized' })
  req.user = user
  next()
}
```

### Session noch aktiv beim Reload
Beim App-Start prüfen ob eine offene Session existiert (endedAt = null) → Timer automatisch weiterlaufen lassen.

---

## 🔑 ENV Variables

```bash
# server/.env
DATABASE_URL=postgresql://...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=...

# client/.env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=...
VITE_API_URL=http://localhost:3000
```
