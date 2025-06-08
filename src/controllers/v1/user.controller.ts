import { FastifyReply, FastifyRequest } from 'fastify';
import { userService } from '../../services/v1/user.service';

export const userController = {
  getAllUsers: async (request: FastifyRequest, reply: FastifyReply) => {
    const [users, error] = await userService.getAllUsers();
    if (error) {
      return reply.status(500).send({ message: 'Internal server error' });
    }
    reply.send(users);
  },
  getSingleUser: async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const [user, error] = await userService.getSingleUser(id);
    if (error) {
      return reply.status(500).send({ message: 'Internal server error' });
    }
    if (!user) {
      return reply.status(404).send({ message: 'User not found' });
    }
    reply.send(user);
  },
  createUser: async (request: FastifyRequest, reply: FastifyReply) => {
    const { name, email, role } = request.body as {
      name: string;
      email: string;
      role?: string;
    };
    const [user, error] = await userService.createUser({ name, email, role });
    if (error) {
      return reply.status(500).send({ message: 'Internal server error' });
    }
    reply.status(201).send(user);
  },
  updateUser: async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const { name, email } = request.body as { name?: string; email?: string };
    const [user, error] = await userService.updateUser(id, { name, email });
    if (error) {
      return reply.status(500).send({ message: 'Internal server error' });
    }
    if (!user) {
      return reply.status(404).send({ message: 'User not found' });
    }
    reply.send(user);
  },
  deleteUser: async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const [user, error] = await userService.deleteUser(id);
    if (error) {
      return reply.status(500).send({ message: 'Internal server error' });
    }
    if (!user) {
      return reply.status(404).send({ message: 'User not found' });
    }
    reply.send(user);
  },
  getPaginatedUsers: async (request: FastifyRequest, reply: FastifyReply) => {
    //fix lint in the future
    const { draw, start = 0, length = 10, search = {}, order = [] } = request.query as any;

    console.log('Paginated users request:', {
      start,
      length,
      order,
    });

    // Pass all relevant params to the service
    const [result, error] = await userService.getPaginatedUsers(
      Number(start),
      Number(length),
      search,
      order
    );

    if (error) {
      return reply.status(500).send({ message: 'Internal server error' });
    }

    // DataTables expects draw to be returned as-is
    reply.send({
      draw: Number(draw) || 0,
      ...(typeof result === 'object' && result !== null ? result : {}),
    });
  },
  enableUser: async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const [user, error] = await userService.enableUser(id);
    if (error) {
      return reply.status(500).send({ message: 'Internal server error' });
    }
    if (!user) {
      return reply.status(404).send({ message: 'User not found' });
    }
    reply.send({ message: 'User enabled', user });
  },
  disableUser: async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const [user, error] = await userService.disableUser(id);
    if (!user) {
      return reply.status(404).send({ message: 'User not found' });
    }
    if (error) {
      return reply.status(500).send({ message: 'Internal server error' });
    }
    reply.send({ message: 'User disabled', user });
  },
};
