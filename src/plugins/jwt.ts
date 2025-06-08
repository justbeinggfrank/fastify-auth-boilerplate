import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import 'dotenv/config';

// Extend FastifyInstance type to include 'authenticate'
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export default fp(async function (fastify: FastifyInstance) {
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'supersecret', // Use environment variable in real apps
  });

  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
});
