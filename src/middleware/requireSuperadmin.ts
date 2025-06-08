import { FastifyReply, FastifyRequest } from 'fastify';

export async function requireSuperadmin(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { role?: string } | undefined;
  if (user?.role !== 'superadmin') {
    return reply.code(403).send({ message: 'Action Forbidden' });
  }
}
