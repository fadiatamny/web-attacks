import { createServer } from 'http'

import app from './app'

const port = process.env.PORT || 5070
app.set('port', port)

const server = createServer(app)

server.listen(app.get('port'), () => {
    console.log(`Server Listening on port ${port}`)
})
