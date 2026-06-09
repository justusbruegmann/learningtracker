import Router from "express"
import {requireAuth} from '../middleware/auth.js'
import {sessionCreate,sessionEnd,getUserSession,getSessionOpen} from "../service/session.js"
import {getSession, getSessionsFromUser} from "../repository/session.js";

const router = Router();

router.get('/', requireAuth, (req, res) => {
    const userId = req.user?.id

    if (!userId) {
        return res.status(401).json({error: 'Unauthorized'})
    }

    res.send("Hello World!");
});

router.post('/', requireAuth, async (req, res) => {
    const userId = req.user?.id
    if (!userId) {
        return res.status(401).json({error: 'Unauthorized'})
    }
    const { title } = (req.body ?? {}) as { title?: string };
    if (title === undefined || title === null) {
        return res.status(400).json({error: 'Bad Request'})
    }
    const session = await sessionCreate(userId, title);
    if (!session) {
        return res.status(500).json({error: "Internal Server Error"})
    }
    return res.status(200).send("success")
})

router.put("/end/:id", requireAuth, async (req, res) => {
    const userId = req.user?.id
    if (!userId) {
        return res.status(401).json({error: 'Unauthorized'})
    }
    const id : any = req.params.id;
    if (!id) {
        return res.status(400).json({error: 'Bad Request'})
    }

    const session = await getSession(id)
    if (!session) {
        return res.status(404).json({error: 'Not Found'})
    }
    if (session.userId !== userId) {
        return res.status(403).json({error: "Forbidden"})
    }
    if (session.endedAt !== null) {
        return res.status(403).json({error: 'Forbidden'})
    }

    const endSession = await sessionEnd(id);
    if (!endSession) {
        return res.status(500).json({error: "Internal Server Error"})
    }
    return res.status(200).send("success")
})

router.get("/sessions", requireAuth, async (req, res) => {
    const userId = req.user?.id
    if (!userId) {
        return res.status(401).json({error: 'Unauthorized'})
    }
    const sessions = await getSessionsFromUser(userId)
    if (!sessions || sessions.length === 0) {
        return res.status(404).json({error: 'Not Found'})
    }
    return res.status(200).send(sessions)
})

router.get("/opensession", requireAuth, async (req, res) => {
    const userId = req.user?.id
    if (!userId) {
        return res.status(401).json({error: 'Unauthorized'})
    }
    const openSession: any = await getSessionOpen(userId)
    if (!openSession) {
        return res.status(404).json({error: 'Not Found'})
    }
    return res.status(200).send(openSession)
})

export default router;