import { FastifyInstance } from 'fastify';
import { authController } from '../../controllers/v1/auth.controller';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', authController.register);
  fastify.post('/login', authController.login);
  fastify.get('/profile', { preHandler: [fastify.authenticate] }, authController.profile);
  fastify.get('/logout', { preHandler: [fastify.authenticate] }, authController.logout);
  fastify.post(
    '/change-password',
    { preHandler: [fastify.authenticate] },
    authController.changePassword
  );
  fastify.post('/forgot-password', authController.forgotPassword);
  fastify.post('/reset-password', authController.resetPassword);
}
