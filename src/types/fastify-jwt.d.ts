import 'fastify';
import '@fastify/jwt';

declare module 'fastify' {
  interface FastifyInstance {
    jwt: import('@fastify/jwt').FastifyJWT;
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
