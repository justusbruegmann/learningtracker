import {upsertUserSettings, getUserSettings} from "../repository/userSettings.js";



export async function upsertData(userId:string, body:any) {
    const result = await upsertUserSettings(userId, body);
    return result;
}

export async function getData(userId:string) {
    const result = await getUserSettings(userId);
    return result;
}