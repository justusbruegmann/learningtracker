# 📚 StudyFlow — Profile Page Plan

## 🎯 Konzept

Eine Profilseite wo der User seine täglichen und wöchentlichen Lernziele setzen kann. Die Ziele werden in der DB gespeichert und im Dashboard für Fortschrittsbalken genutzt. Außerdem kann der User seine aktiven Lerntage konfigurieren.

---

## 🗂️ Datenbankschema

### UserSettings (neu)
```
id                   uuid, PK
user_id              uuid, FK → User (UNIQUE — 1 Zeile pro User)
daily_goal_mins      integer      default: 90
weekly_goal_mins     integer      default: 300
weekly_goal_sessions integer      default: 5
active_days          text         default: '1,2,3,4,5'  (0=So … 6=Sa)
updated_at           timestamp
```

### Drizzle Schema

```typescript
// server/src/db/schema.ts

import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core'

export const userSettings = pgTable('user_settings', {
  id:                  uuid('id').defaultRandom().primaryKey(),
  userId:              uuid('user_id').notNull().unique(),
  dailyGoalMins:       integer('daily_goal_mins').notNull().default(90),
  weeklyGoalMins:      integer('weekly_goal_mins').notNull().default(300),
  weeklyGoalSessions:  integer('weekly_goal_sessions').notNull().default(5),
  activeDays:          text('active_days').notNull().default('1,2,3,4,5'),
  updatedAt:           timestamp('updated_at').notNull().defaultNow(),
})
```

---

## 🖥️ Frontend — Seiten & Komponenten

### Neue Seite
```
/profile   → Account-Info + Ziele setzen
```

### Komponenten
- `GoalCard.vue` — Karte mit Input-Feldern für ein Ziel (daily oder weekly)
- `DayPicker.vue` — Wochentag-Toggle (Mo–So als Buttons)
- `ProfileHeader.vue` — Avatar + Name + E-Mail

### Pinia Store (neu)
```typescript
// stores/settings.ts
export const useSettingsStore = defineStore('settings', {
  state: () => ({
    dailyGoalMins: 90,
    weeklyGoalMins: 300,
    weeklyGoalSessions: 5,
    activeDays: [1, 2, 3, 4, 5],
  }),
  actions: {
    async fetchSettings() { /* GET /api/settings */ },
    async saveSettings(payload) { /* PUT /api/settings */ },
  }
})
```

> Settings beim App-Start einmal laden → Dashboard liest direkt aus dem Store.

---

## ⚙️ Backend — API Endpoints (Express)

```
GET   /api/settings   → Settings des eingeloggten Users laden
PUT   /api/settings   → Settings anlegen oder aktualisieren (upsert)
```

> Beide Routes durch Supabase JWT Auth geschützt (wie alle anderen Routes).

### Upsert-Logik (Drizzle)

```typescript
// controllers/settings.ts
await db.insert(userSettings)
  .values({ userId: req.user.id, ...body })
  .onConflictDoUpdate({
    target: userSettings.userId,
    set: { ...body, updatedAt: new Date() }
  })
```

> Upsert statt separatem Create/Update — verhindert Fehler wenn noch keine Settings-Zeile existiert.

---

## 📁 Neue Dateien

```
studyflow/
├── client/
│   └── src/
│       ├── views/
│       │   └── ProfileView.vue          ← neue Seite
│       ├── components/
│       │   ├── GoalCard.vue             ← neu
│       │   ├── DayPicker.vue            ← neu
│       │   └── ProfileHeader.vue        ← neu
│       └── stores/
│           └── settings.ts              ← neu
└── server/
    └── src/
        ├── routes/
        │   └── settings.ts              ← neu
        ├── controllers/
        │   └── settings.ts              ← neu
        └── db/
            └── schema.ts                ← userSettings hinzufügen
```

---

## 🗺️ Roadmap

### Phase 1 — DB & Backend (Tag 1)
- [ ] `user_settings` Tabelle zum Drizzle Schema hinzufügen
- [ ] Migration ausführen (`drizzle-kit push`)
- [ ] `GET /api/settings` implementieren
- [ ] `PUT /api/settings` mit Upsert implementieren
- [ ] Auth Middleware auf beide Routes anwenden

### Phase 2 — Frontend (Tag 2)
- [ ] Pinia Settings Store anlegen
- [ ] Settings beim App-Start laden (in `App.vue` oder Router Guard)
- [ ] `DayPicker.vue` Komponente bauen
- [ ] `GoalCard.vue` mit Input + Save-Button bauen
- [ ] `ProfileView.vue` zusammensetzen
- [ ] Route `/profile` im Router registrieren
- [ ] Nav-Link "Profile" hinzufügen

### Phase 3 — Dashboard verbinden (Tag 3)
- [ ] Fortschrittsbalken im Dashboard an Store-Werte binden
- [ ] Weekly-Goal-Karte im Dashboard hinzufügen
- [ ] Streak-Badge in Navbar einbauen

---

## ⚠️ Wichtige technische Details

### active_days als Text speichern
Wochentage als kommaseparierter String (`'1,2,3,4,5'`) — kein Array-Typ nötig, einfach zu parsen:

```typescript
// Parsen
const days = settings.activeDays.split(',').map(Number)  // [1,2,3,4,5]

// Speichern
const activeDays = selectedDays.join(',')  // "1,2,3,4,5"
```

### Settings beim App-Start laden
Einmal laden und im Store cachen — nicht auf jeder Seite neu fetchen:

```typescript
// router/index.ts
router.beforeEach(async (to) => {
  const auth = useAuthStore()
  const settings = useSettingsStore()
  if (auth.user && !settings.loaded) {
    await settings.fetchSettings()
  }
})
```

### Default-Settings beim ersten Login
Beim ersten `GET /api/settings` existiert noch keine Zeile → Backend gibt Defaults zurück statt 404:

```typescript
// controllers/settings.ts — GET
const existing = await db.query.userSettings.findFirst({
  where: eq(userSettings.userId, req.user.id)
})
res.json(existing ?? { dailyGoalMins: 90, weeklyGoalMins: 300, weeklyGoalSessions: 5, activeDays: '1,2,3,4,5' })
```

---

## 🔑 Keine neuen ENV Variables nötig

Alle bestehenden ENV Variables aus Phase 1 reichen aus.