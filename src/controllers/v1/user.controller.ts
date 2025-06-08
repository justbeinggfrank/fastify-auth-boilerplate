import { FastifyReply, FastifyRequest } from 'fastify';
import { userService } from '../../services/v1/user.service';
import { z } from 'zod';

// Zod schemas
const userIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/),
});

const createUserSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z.string().email().trim(),
  role: z.enum(['user', 'admin', 'superadmin']).optional(),
});

const updateUserSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  email: z.string().email().trim().optional(),
  role: z.enum(['user', 'admin', 'superadmin']).optional(),
});

export const userController = {
  getAllUsers: async (request: FastifyRequest, reply: FastifyReply) => {
    const [users, error] = await userService.getAllUsers();
    if (error) {
      return reply.status(500).send({ message: 'Internal server error' });
    }
    reply.send(users);
  },
  getSingleUser: async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = userIdParamSchema.safeParse(request.params);
    if (!parseResult.success) {
      return reply
        .status(400)
        .send({ message: 'Invalid user id', errors: parseResult.error.errors });
    }
    const { id } = parseResult.data;
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
    const parseResult = createUserSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ message: 'Invalid input', errors: parseResult.error.errors });
    }
    const { name, email, role } = parseResult.data;
    const [user, error] = await userService.createUser({ name, email, role });
    if (error) {
      return reply.status(500).send({ message: 'Internal server error' });
    }
    reply.status(201).send(user);
  },
  updateUser: async (request: FastifyRequest, reply: FastifyReply) => {
    const paramResult = userIdParamSchema.safeParse(request.params);
    if (!paramResult.success) {
      return reply
        .status(400)
        .send({ message: 'Invalid user id', errors: paramResult.error.errors });
    }
    const bodyResult = updateUserSchema.safeParse(request.body);
    if (!bodyResult.success) {
      return reply.status(400).send({ message: 'Invalid input', errors: bodyResult.error.errors });
    }
    const { id } = paramResult.data;
    const { name, email, role } = bodyResult.data;
    const [user, error] = await userService.updateUser(id, { name, email, role });
    if (error) {
      return reply.status(500).send({ message: 'Internal server error' });
    }
    if (!user) {
      return reply.status(404).send({ message: 'User not found' });
    }
    reply.send(user);
  },
  deleteUser: async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = userIdParamSchema.safeParse(request.params);
    if (!parseResult.success) {
      return reply
        .status(400)
        .send({ message: 'Invalid user id', errors: parseResult.error.errors });
    }
    const { id } = parseResult.data;
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
    const parseResult = userIdParamSchema.safeParse(request.params);
    if (!parseResult.success) {
      return reply
        .status(400)
        .send({ message: 'Invalid user id', errors: parseResult.error.errors });
    }
    const { id } = parseResult.data;
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
    const parseResult = userIdParamSchema.safeParse(request.params);
    if (!parseResult.success) {
      return reply
        .status(400)
        .send({ message: 'Invalid user id', errors: parseResult.error.errors });
    }
    const { id } = parseResult.data;
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
