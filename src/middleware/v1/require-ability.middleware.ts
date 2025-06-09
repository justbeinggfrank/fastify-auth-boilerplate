import { FastifyRequest, FastifyReply } from 'fastify';
import { defineAbilityFor } from '../../utils/v1/ability';

import type { Actions, Subjects } from '../../utils/v1/ability';

export function requireAbility(action: Actions, subject: Subjects) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as { role: string };
    const ability = defineAbilityFor(user.role);

    if (!ability.can(action, subject)) {
      return reply.status(403).send({ message: 'Forbidden' });
    }
  };
}
