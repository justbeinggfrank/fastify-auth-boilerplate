import { FastifyInstance } from 'fastify';
import { requireSuperadmin } from '../middleware/requireSuperadmin';
import { userController } from '../controllers/user.controller';

export async function userRoutes(fastify: FastifyInstance) {
  // Get all users
  fastify.get('/users', userController.getAllUsers);

  // Get single user
  fastify.get('/users/:id', userController.getSingleUser);

  // Create user
  fastify.post('/users', userController.createUser);

  // Update user
  fastify.put('/users/:id', userController.updateUser);

  // Delete user
  fastify.delete('/users/:id', userController.deleteUser);

  // Display users with limit and pagination for DataTables
  fastify.get('/users-paginated', userController.getPaginatedUsers);

  // Enable user account (superadmin only)
  fastify.put(
    '/users/:id/enable',
    { preHandler: [fastify.authenticate, requireSuperadmin] },
    userController.enableUser
  );

  // Disable user account (superadmin only)
  fastify.put(
    '/users/:id/disable',
    { preHandler: [fastify.authenticate, requireSuperadmin] },
    userController.disableUser
  );
}
