import { Router, Request, Response } from 'express'
import { PostsController } from '../controllers/posts.controller'

const router = Router()

router.get('/posts', async (req: Request, res: Response) => {
    try {
        res.status(200).json(await PostsController.get())
    } catch (err) {
        res.status(500).send('Error Occured')
    }
})

router.post('/posts', async (req: Request, res: Response) => {
    try {
        await PostsController.post(req)
        res.status(200).send('Success')
    } catch (err) {
        res.status(500).send('Error Occured')
    }
})

export default router
