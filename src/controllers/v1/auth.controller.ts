import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../prisma/client';
import bcrypt from 'bcrypt';
import { sendMail } from '../../utils/v1/mailer';
import { z } from 'zod';
import { getJwtInstance } from '../../utils/v1/helper';

const registerSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z.string().email().trim(),
  password: z.string().min(6).max(100),
});

const loginSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(6).max(100),
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(6).max(100),
  newPassword: z.string().min(6).max(100),
});

const forgotPasswordSchema = z.object({
  email: z.string().email().trim(),
});

const resetPasswordSchema = z.object({
  resetToken: z.string().min(1),
  newPassword: z.string().min(6).max(100),
});

export const authController = {
  register: async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = registerSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ message: 'Invalid input', errors: parseResult.error.errors });
    }
    const { name, email, password } = parseResult.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return reply.status(400).send({ message: 'Email already in use' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });

    reply.send({ id: user.id, email: user.email });
  },

  login: async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = loginSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ message: 'Invalid input', errors: parseResult.error.errors });
    }
    const { email, password } = parseResult.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return reply.code(401).send({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return reply.code(403).send({ message: 'Account is inactive' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return reply.code(401).send({ message: 'Invalid credentials' });

    const jwt = getJwtInstance(request);
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role });
    reply.send({ token });
  },

  profile: async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request.user as { id: number; email: string; role: string }).id;

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
  },

  logout: async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send({ message: 'Logged out successfully. Please remove the token on the client.' });
  },

  changePassword: async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = changePasswordSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ message: 'Invalid input', errors: parseResult.error.errors });
    }
    const { oldPassword, newPassword } = parseResult.data;
    const userId = (request.user as { id: number; email: string; role: string }).id;

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
  },

  forgotPassword: async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = forgotPasswordSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ message: 'Invalid input', errors: parseResult.error.errors });
    }
    const { email } = parseResult.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.send({ message: 'If the email exists, a reset link will be sent.' });
    }

    const jwt = getJwtInstance(request);
    const resetToken = jwt.sign(
      { id: user.id, email: user.email, type: 'reset' },
      { expiresIn: '15m' }
    );

    try {
      await sendMail({
        to: user.email,
        subject: 'Password Reset',
        text: `Your reset token: ${resetToken}`,
        html: `<p>Your reset token: <b>${resetToken}</b></p>`,
      });

      return reply.send({ message: 'Reset email sent successfully' });
    } catch (error) {
      console.error('Error sending reset email:', error);
      return reply.code(500).send({ message: 'Failed to send reset email' });
    }
  },

  resetPassword: async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = resetPasswordSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ message: 'Invalid input', errors: parseResult.error.errors });
    }
    const { resetToken, newPassword } = parseResult.data;

    try {
      const jwt = getJwtInstance(request);
      const payload = jwt.verify(resetToken) as {
        id: string;
        email: string;
        type: string;
      };
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
  },
};
