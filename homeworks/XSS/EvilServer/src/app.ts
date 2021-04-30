import express, { Application, Request, Response, NextFunction } from 'express'
import path from 'path'
import cors from 'cors'
import api from './routers/api'

interface ResponseError extends Error {
    status?: number
}

const app: Application = express()

const options: cors.CorsOptions = {
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: process.env.API_URL || 'localhost',
    preflightContinue: false,
    credentials: true
}

app.use(cors(options))

app.use(express.json())
app.use(
    express.urlencoded({
        extended: false
    })
)

app.use(express.static(path.resolve(__dirname, '../public')))

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.header('X-XSS-Protection', '0')
    res.header('Content-Type', 'application/json;charset=UTF-8')

    res.set('Content-Type', 'application/json')
    next()
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: ResponseError, req: Request, res: Response, next: NextFunction) => {
    console.log(err)
    res.status(err.status || 500)
    res.send('Error Occured!\nPlease try again later')
})

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, '../public/index.html'))
})

app.use('/api', api)

export default app
