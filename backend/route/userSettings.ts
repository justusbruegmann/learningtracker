import Router from "express"
import {requireAuth} from '../middleware/auth.js'
import {upsertUserSettings, getUserSettings} from "../repository/userSettings.js";


const router = Router();

router.put("/", requireAuth, async (req, res) => {
    const userId = req.user?.id
    if (!userId) {
        return res.status(401).send("Not authorized")
    }

    const body = req.body;
    if (!body) {
        return res.status(400).send("400")
    }

    const payload = {
        dailyGoalMins: body.dailyGoalMins ?? 90,
        weeklyGoalMins: body.weeklyGoalMins ?? 300,
        weeklyGoalSessions: body.weeklyGoalSessions ?? 5,
        activeDays: body.activeDays ?? [1, 2, 3, 4, 5],
    }
    try {
        const result = await upsertUserSettings(userId, payload)
        return res.status(200).send(result)
    } catch (e) {
        return res.status(500).send("error")
    }
})

router.get("/", requireAuth, async (req, res) => {
    const userId = req.user?.id
    if (!userId) {
        return res.status(401).send("Not authorized")
    }
    try {
        const result = await getUserSettings(userId);
        return res.status(200).send(result)
    } catch (e) {
        return res.status(500).send("error")
    }
})



export default router;
