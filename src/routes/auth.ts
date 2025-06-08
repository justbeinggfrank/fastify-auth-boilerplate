import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../prisma/client';
import bcrypt from 'bcrypt';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', async (request, reply) => {
    const { name, email, password } = request.body as {
      name: string;
      email: string;
      password: string;
    };

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return reply.status(400).send({ message: 'Email already in use' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });

    reply.send({ id: user.id, email: user.email });
  });

  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return reply.code(401).send({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return reply.code(403).send({ message: 'Account is inactive' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return reply.code(401).send({ message: 'Invalid credentials' });

    const token = fastify.jwt.sign({ id: user.id, email: user.email, role: user.role });
    reply.send({ token });
  });

  fastify.get(
    '/profile',
    { preHandler: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      // request.user is populated by fastify-jwt after authentication
      console.log('Authenticated user:', request.user);
      const userId = (request.user as { id: number; email: string; role: string }).id;

      // fetch user data from DB, exclude password for security
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });

      if (!user) {
        return reply.code(404).send({ message: 'User not found' });
      }

      return { user };
    }
  );

  fastify.get(
    '/logout',
    { preHandler: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      // For JWT, logout is handled client-side by deleting the token.
      // Optionally, you can implement token blacklisting here.
      // For now, just send a message.
      reply.send({ message: 'Logged out successfully. Please remove the token on the client.' });
    }
  );

  // Change password (authenticated user)
  fastify.post(
    '/change-password',
    { preHandler: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = (request.user as { id: number; email: string; role: string }).id;
      const { oldPassword, newPassword } = request.body as {
        oldPassword: string;
        newPassword: string;
      };

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || !user.password) {
        return reply.code(404).send({ message: 'User not found' });
      }

      const isValid = await bcrypt.compare(oldPassword, user.password);
      if (!isValid) {
        return reply.code(400).send({ message: 'Old password is incorrect' });
      }

      const hashed = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashed },
      });

      reply.send({ message: 'Password changed successfully' });
    }
  );

  // Forgot password (send reset token)
  fastify.post('/forgot-password', async (request, reply) => {
    const { email } = request.body as { email: string };
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // For security, do not reveal if user exists
      return reply.send({ message: 'If the email exists, a reset link will be sent.' });
    }

    // Generate a reset token (JWT, expires in 15 minutes)
    const resetToken = fastify.jwt.sign(
      { id: user.id, email: user.email, type: 'reset' },
      { expiresIn: '15m' }
    );

    // Here you would send the resetToken via email to the user
    // For demo, just return the token (not secure for production)
    reply.send({ message: 'Reset token generated', resetToken });
  });

  // Reset password using token
  fastify.post('/reset-password', async (request, reply) => {
    const { resetToken, newPassword } = request.body as {
      resetToken: string;
      newPassword: string;
    };

    try {
      const payload = fastify.jwt.verify(resetToken) as { id: string; email: string; type: string };
      if (payload.type !== 'reset') {
        return reply.code(400).send({ message: 'Invalid reset token' });
      }

      const hashed = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: Number(payload.id) },
        data: { password: hashed },
      });

      reply.send({ message: 'Password reset successfully' });
    } catch (err) {
      console.error('Reset password error:', err);
      return reply.code(400).send({ message: 'Invalid or expired reset token' });
    }
  });
}
