import sqlite3 from 'sqlite3'

export class SQLConnector {
    private db: sqlite3.Database

    private static createTables(db: sqlite3.Database) {
        db.run('CREATE TABLE IF NOT EXISTS `Posts` (`message` varchar(256))')
    }

    constructor(fileName?: string) {
        sqlite3.verbose()
        this.db = new sqlite3.Database(fileName ?? './public/db/database.sqlite', (err) => {
            if (err) {
                throw {
                    status: 500,
                    message: 'Error performing connection',
                    err: err
                }
            } else {
                SQLConnector.createTables(this.db)
            }
        })

        this.db.configure('busyTimeout', 1000)
    }

    public async getData(sql: string, params: any) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all(sql, params, (err, rows) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    if (rows) {
                        resolve(rows)
                        return
                    }
                })
            })
        })
    }

    public async query(sql: string, params: any) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, (err) => {
                if (err) reject(err)
                else resolve(undefined)
            })
        })
    }
}
