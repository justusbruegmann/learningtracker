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

export const userSettings = pgTable('user_settings', {
    id:                  uuid('id').defaultRandom().primaryKey(),
    userId:              uuid('user_id').notNull().unique(),
    dailyGoalMins:       integer('daily_goal_mins').notNull().default(90),
    weeklyGoalMins:      integer('weekly_goal_mins').notNull().default(300),
    weeklyGoalSessions:  integer('weekly_goal_sessions').notNull().default(5),
    activeDays:          text('active_days').notNull().default('1,2,3,4,5'),
    updatedAt:           timestamp('updated_at').notNull().defaultNow(),
})