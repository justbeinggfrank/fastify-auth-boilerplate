import { prisma } from '../prisma/client';

export const userService = {
  // Get all users
  getAllUsers: async () => {
    try {
      const users = await prisma.user.findMany();
      return [users, null];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [null, error];
    }
  },
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
    start?: number,
    length?: number,
    search?: { value?: string } | string,
    orderBy?: { column?: string; dir?: 'asc' | 'desc' }
  ) => {
    try {
      const skip = typeof start === 'number' && !isNaN(start) ? start : 0;
      const take = typeof length === 'number' && !isNaN(length) ? length : 10;

      // Handle search value (object or string)
      let searchValue = '';
      if (typeof search === 'object' && search !== null && 'value' in search) {
        searchValue = (search.value || '').trim();
      } else if (typeof search === 'string') {
        searchValue = search.trim();
      }

      const where = searchValue
        ? {
            OR: [{ name: { contains: searchValue } }, { email: { contains: searchValue } }],
          }
        : {};

      // Handle orderBy
      let order = undefined;
      if (orderBy && orderBy.column) {
        order = { [orderBy.column]: orderBy.dir === 'desc' ? 'desc' : 'asc' };
      }

      const [users, totalCount, filteredCount] = await Promise.all([
        prisma.user.findMany({
          skip,
          take,
          where,
          ...(order ? { orderBy: order } : {}),
        }),
        prisma.user.count(),
        where && Object.keys(where).length > 0 ? prisma.user.count({ where }) : prisma.user.count(),
      ]);

      return [
        {
          data: users,
          recordsTotal: totalCount,
          recordsFiltered: filteredCount,
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
