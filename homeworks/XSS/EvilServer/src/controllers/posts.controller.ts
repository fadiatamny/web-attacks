import { Request } from 'express'
import { SQLConnector } from '../connector/sqlConnector'

export class PostsController {
    private static connector = new SQLConnector()
    public static async get() {
        const query = `SELECT * FROM Cookies;`
        return await this.connector.getData(query, [])
    }

    public static async post(req: Request) {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const query = `INSERT INTO Cookies (site, cookie) VALUES (?, ?);`
        if (!req.params.cookie) throw 'Missing Variables'
        await this.connector.query(query, [ip, req.params.cookie])
    }
}
