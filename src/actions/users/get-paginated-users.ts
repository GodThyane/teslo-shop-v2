'use server';

import { prisma } from '@/lib/prisma';

interface PaginationOptions {
   page?: number;
   take?: number;
}

export const getPaginatedUsers = async ({
   page = 1,
   take = 10,
}: PaginationOptions) => {
   if (isNaN(Number(page))) page = 1;
   if (page < 1) page = 1;

   try {
      //1. Obtener los usuarios
      const users = await prisma.user.findMany({
         take,
         skip: (page - 1) * take,
         orderBy: {
            name: 'desc',
         },
         select: {
            id: true,
            email: true,
            name: true,
            image: true,
            role: true,
            emailVerified: true,
         },
      });

      //2. Obtener el total de páginas
      const total = await prisma.user.count();
      const totalPages = Math.ceil(total / take);

      return {
         currentPage: page,
         totalPages,
         users,
      };
   } catch (e) {
      throw new Error('Error fetching paginated users');
   }
};
