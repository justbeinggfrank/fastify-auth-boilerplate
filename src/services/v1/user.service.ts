import { prisma } from '../../prisma/client';

export const userService = {
  getSingleUser: async (id: string) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: Number(id) } });
      return [user, null];
    } catch (error) {
      console.error('Error fetching user:', error);
      return [null, error];
    }
  },
  createUser: async (data: { name: string; email: string; role?: string }) => {
    try {
      const user = await prisma.user.create({ data });
      return [user, null];
    } catch (error) {
      console.error('Error creating user:', error);
      return [null, error];
    }
  },
  updateUser: async (id: string, data: { name?: string; email?: string; role?: string }) => {
    try {
      const user = await prisma.user.update({
        where: { id: Number(id) },
        data,
      });
      return [user, null];
    } catch (error) {
      console.error('Error updating user:', error);
      return [null, error];
    }
  },
  deleteUser: async (id: string) => {
    try {
      const user = await prisma.user.delete({ where: { id: Number(id) } });
      return [user, null];
    } catch (error) {
      console.error('Error deleting user:', error);
      return [null, error];
    }
  },
  getPaginatedUsers: async (
    skip: number,
    take: number,
    where: Record<string, unknown>,
    order?: { [key: string]: 'asc' | 'desc' }[]
  ) => {
    try {
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          skip,
          take,
          where,
          orderBy: order,
        }),
        prisma.user.count({ where }),
      ]);
      return [
        {
          data: users,
          total,
          skip,
          take,
        },
        null,
      ];
    } catch (error) {
      console.error('Error fetching paginated users:', error);
      return [null, error];
    }
  },
  enableUser: async (id: string) => {
    try {
      const user = await prisma.user.update({
        where: { id: Number(id) },
        data: { isActive: true },
      });
      return [user, null];
    } catch (error) {
      console.error('Error enabling user:', error);
      return [null, error];
    }
  },
  disableUser: async (id: string) => {
    try {
      const user = await prisma.user.update({
        where: { id: Number(id) },
        data: { isActive: false },
      });
      return [user, null];
    } catch (error) {
      console.error('Error disabling user:', error);
      return [null, error];
    }
  },
};
