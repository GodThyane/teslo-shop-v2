'use server';

import { prisma } from '@/lib/prisma';
import { Category } from '@/interfaces/category.interface';

export const getAllCategories = async (): Promise<Category[]> => {
   try {
      return await prisma.category.findMany({
         orderBy: {
            name: 'asc',
         },

         select: {
            id: true,
            name: true,
         },
      });
   } catch (e) {
      console.log(e);
      throw new Error('Error fetching categories');
   }
};
