'use server';

import { prisma } from '@/lib/prisma';

export const getCountries = async () => {
   try {
      return await prisma.country.findMany({
         orderBy: {
            name: 'asc',
         },
      });
   } catch (e) {
      console.log(e);
      return [];
   }
};
