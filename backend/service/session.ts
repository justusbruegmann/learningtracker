import {createSession, getOpenSession, getSessionsFromUser, deleteSession, endSession,getSession} from "../repository/session.js"

export async function sessionCreate(userId: string, title: string) {
    try {
        await createSession(userId, title);
        return true;
    } catch (e) {
        return false;
    }
}

export async function sessionEnd(id:string) {
    try {
        const now = new Date();
        const openSession = await getSession(id);
        if (!openSession) {
            return false;
        }

        const started:Date = openSession.createdAt;
        const duration: number = Math.floor((now.getTime() - started.getTime())/1000);

        await endSession(id,duration,now)
        return true;
    } catch (e) {
        return false;
    }
}

export async function getSessionOpen(userid  : string) {
    try {
        const openSession = await getOpenSession(userid);
        return openSession;
    } catch (e) {
        return false;
    }
}

export async function getUserSession(userid  : string) {
    try {
        const sessions = await getSessionsFromUser(userid);
        return sessions;
    } catch (e) {
        return false;
    }
}

