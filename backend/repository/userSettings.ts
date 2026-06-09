import {db} from "../app.js"
import {userSettings} from "../drizzle/schema.js";
import {eq} from "drizzle-orm";

export async function upsertUserSettings(userId: string, body: any) {
    await db.insert(userSettings)
        .values({ userId: userId, ...body })
        .onConflictDoUpdate({
            target: userSettings.userId,
            set: { ...body, updatedAt: new Date() }
        })
}

export async function getUserSettings(userId: string) {
    return db.select().from(userSettings).where(eq(userSettings.userId, userId)).limit(1);
}