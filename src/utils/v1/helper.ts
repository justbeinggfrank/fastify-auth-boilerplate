import { FastifyRequest } from 'fastify';

export function getJwtInstance(request: FastifyRequest) {
  // Type assertion: FastifyInstance with jwt property
  return (request.server as typeof request.server & { jwt: (typeof request.server)['jwt'] }).jwt;
}
