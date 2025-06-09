import { FastifyInstance } from 'fastify';
import { userController } from '../../controllers/v1/user.controller';
import { requireAbility } from '../../middleware/v1/require-ability.middleware';

export async function userRoutes(fastify: FastifyInstance) {
  // Get all users
  fastify.get(
    '/users',
    { preHandler: [fastify.authenticate, requireAbility('read', 'User')] },
    userController.getAllUsers
  );

  // Get single user
  fastify.get(
    '/users/:id',
    { preHandler: [fastify.authenticate, requireAbility('read', 'User')] },
    userController.getSingleUser
  );

  // Create user
  fastify.post(
    '/users',
    { preHandler: [fastify.authenticate, requireAbility('create', 'User')] },
    userController.createUser
  );

  // Update user
  fastify.put(
    '/users/:id',
    { preHandler: [fastify.authenticate, requireAbility('update', 'User')] },
    userController.updateUser
  );

  // Delete user

  fastify.delete(
    '/users/:id',
    { preHandler: [fastify.authenticate, requireAbility('delete', 'User')] },
    userController.deleteUser
  );

  // Display users with limit and pagination for DataTables
  fastify.get(
    '/users-paginated',
    { preHandler: [fastify.authenticate, requireAbility('read', 'User')] },
    userController.getPaginatedUsers
  );

  // Enable user account (superadmin only)
  fastify.put(
    '/users/:id/enable',
    { preHandler: [fastify.authenticate, requireAbility('enable', 'User')] },
    userController.enableUser
  );

  // Disable user account (superadmin only)
  fastify.put(
    '/users/:id/disable',
    { preHandler: [fastify.authenticate, requireAbility('disable', 'User')] },
    userController.disableUser
  );
}
