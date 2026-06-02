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

export const tags = pgTable('tags', {
    id:     uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull(),
    name:   text('name').notNull(),
})

export const sessionTags = pgTable('session_tags', {
    sessionId: uuid('session_id').notNull().references(() => sessions.id),
    tagId:     uuid('tag_id').notNull().references(() => tags.id),
})