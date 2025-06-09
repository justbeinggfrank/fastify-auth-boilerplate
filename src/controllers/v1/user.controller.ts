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
  getPaginatedUsers: async (request: FastifyRequest, reply: FastifyReply) => {
    // Validate query params
    const querySchema = z.object({
      skip: z.coerce.number().min(0).optional(),
      take: z.coerce.number().min(1).max(100).optional(),
      search: z.string().optional(),
      orderBy: z.string().optional(), // field name
      orderDir: z.enum(['asc', 'desc']).optional(),
    });

    const parseResult = querySchema.safeParse(request.query);
    if (!parseResult.success) {
      return reply
        .status(400)
        .send({ message: 'Invalid query params', errors: parseResult.error.errors });
    }
    const { skip = 0, take = 10, search, orderBy, orderDir } = parseResult.data;

    // Build Prisma where clause
    let where = {};
    if (search) {
      where = {
        OR: [{ name: { contains: search } }, { email: { contains: search } }],
      };
    }

    // Build Prisma orderBy
    let order: { [key: string]: 'asc' | 'desc' }[] | undefined;
    if (orderBy && orderDir) {
      order = [{ [orderBy]: orderDir }];
    }

    // Call service with Prisma-style params
    const [result, error] = await userService.getPaginatedUsers(skip, take, where, order);

    if (error) {
      return reply.status(500).send({ message: 'Internal server error' });
    }

    reply.send(result);
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
