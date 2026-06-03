import {db} from "../app.js"
import {sessions} from "../drizzle/schema.js";
import {eq, and} from "drizzle-orm"
import {isNull} from "drizzle-orm/sql/expressions/conditions";

export async function createSession(userid: string, title: string) {
    const result = await db.insert(sessions).values({"userId": userid, "title": title});
    return result;
}

export async function endSession(id: string, duration: number, date: Date) {
    const result = await db.update(sessions).set({
        "durationSecs": duration,
        "endedAt": date
    }).where(eq(sessions.id, id));
    return result;
}

export async function deleteSession(id: string) {
    const result = await db.delete(sessions).where(eq(sessions.id, id));
    console.log(result);
}

export async function getSessionsFromUser(userid: string) {
    const result = await db.select({
        id: sessions.id,
        title: sessions.title,
        createdAt: sessions.createdAt,
        endedAt: sessions.endedAt,
        note: sessions.note,
        durationSecs: sessions.durationSecs,
    }).from(sessions).where(eq(sessions.userId, userid));
    return result;
}

export async function getOpenSession(userid: string) {
    const result = await db.select({
        id: sessions.id,
        title: sessions.title,
        createdAt: sessions.createdAt,
        endedAt: sessions.endedAt,
        note: sessions.note,
        durationSecs: sessions.durationSecs,
    }).from(sessions).where(and(eq(sessions.userId, userid), isNull(sessions.endedAt)));
    return result;
}

export async function getSession(sessionId: string) {
    const result = await db.select({
        id: sessions.id,
        title: sessions.title,
        createdAt: sessions.createdAt,
        endedAt: sessions.endedAt,
        note: sessions.note,
        durationSecs: sessions.durationSecs,
    }).from(sessions).where(eq(sessions.id, sessionId)).limit(1);
    return result[0] ?? null;
}