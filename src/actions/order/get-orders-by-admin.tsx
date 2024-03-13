'use server';

import { prisma } from '@/lib/prisma';

interface PaginationOptions {
   page?: number;
   take?: number;
}

export const getOrdersByAdmin = async ({
   page = 1,
   take = 10,
}: PaginationOptions) => {
   if (isNaN(Number(page))) page = 1;
   if (page < 1) page = 1;

   try {
      //1. Obtener las órdenes
      const orders = await prisma.order.findMany({
         take,
         skip: (page - 1) * take,
         select: {
            id: true,
            OrderAddress: {
               select: {
                  firstName: true,
                  lastName: true,
               },
            },
            isPaid: true,
            paidAt: true,
         },
      });

      //2. Obtener el total de páginas
      const total = await prisma.order.count();
      const totalPages = Math.ceil(total / take);

      return {
         currentPage: page,
         totalPages,
         orders,
      };
   } catch (e) {
      throw new Error('Error fetching paginated products with images');
   }
};
