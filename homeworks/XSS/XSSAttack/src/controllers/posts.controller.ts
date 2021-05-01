import { Request } from 'express'
import { SQLConnector } from '../connector/sqlConnector'

export class PostsController {
    private static connector = new SQLConnector()
    public static async get() {
        const query = `SELECT * FROM Posts`
        return await this.connector.getData(query, [])
    }

    public static async post(req: Request) {
        const query = `INSERT INTO Posts (message) VALUES (?);`
        if (!req.body.message) throw 'Missing Variables'
        await this.connector.query(query, [req.body.message])
    }
}
