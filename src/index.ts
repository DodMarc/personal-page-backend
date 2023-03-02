import { Log } from "./logger.js";
import { createFastify } from "./server.js";

process.on('uncaughtException', err => Log.error(err))
process.on('unhandledRejection', err => Log.error(err))

// run server
try {
    const server = await createFastify()
    
    await server.ready()
    const port = 3000
    await server.listen({
        port,
        host: '0.0.0.0'
    }).then(() => {
        Log.info(`Server listening on port ${port}...`)
    })
} catch (err) {
    Log.error(err)
    process.exit(1)
}