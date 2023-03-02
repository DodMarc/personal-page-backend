import type { FastifyPluginAsync } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getAllItems } from './guildwars-service.js'

const GuildwarsRoute: FastifyPluginAsync = async (_fastify) => {
    const fastify = _fastify.withTypeProvider<ZodTypeProvider>()

    fastify.get('', {
        schema: {
            response: {
                200: z.string()
            }
        },
    }, async (req, res) => {
            const items = await getAllItems();        
            return res.send(JSON.stringify(items))
        }
    )
}

export default GuildwarsRoute