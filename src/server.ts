import fastify from 'fastify'
import { validatorCompiler, serializerCompiler } from 'fastify-type-provider-zod'
import FastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { fastifyStatic } from '@fastify/static'
import fastifyIo from 'fastify-socket.io'

import path from 'path'
import GuildwarsRoute from './routes/guildwars/guildwars.js'

export const createFastify = async () => {
    const server = fastify({
        logger: {
            transport: {
                target: '@fastify/one-line-logger'
            }
        }
    })

    // global plugins
    server.setValidatorCompiler(validatorCompiler)
    server.setSerializerCompiler(serializerCompiler)

    await server.register(FastifyCors, {origin: '*'})

    await server.register(fastifyStatic, {
        root: path.resolve("./dist"),
        prefix: '/'
    })

    await server.register(fastifyIo, {
        cors: {
            origin: '*'
        }
    })

    await server.register(async (fastify) => {
        //docs
        await server.register(fastifySwagger, {
            swagger: {
                info: {
                    title: 'Personal Webpage Backend',
                    version: 'v0'
                },
                schemes: ['http']
            }
        })

        await server.register(fastifySwaggerUi, {
            routePrefix: "/docs"
        })

        // routes
        fastify.register(GuildwarsRoute, {
            prefix: '/guildwars'
        })
    })


    return server
}