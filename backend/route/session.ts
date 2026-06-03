import Router from "express"
import {requireAuth} from '../middleware/auth.js'

const router = Router();

router.get('/', requireAuth, (req, res) => {
    const userId = req.user?.id

    if (!userId) {
        return res.status(401).json({error: 'Unauthorized'})
    }

    res.send("Hello World!");
});

export default router;