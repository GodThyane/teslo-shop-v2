'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const changeUserRole = async (userId: string, role: string) => {
   try {
      const newRole = role === 'admin' ? 'admin' : 'user';
      const user = await prisma.user.update({
         where: {
            id: userId,
         },
         data: {
            role: newRole,
         },
      });
      if (!user) {
         return {
            ok: false,
            message: 'User not found',
         };
      }

      revalidatePath('/admin/users');

      return {
         ok: true,
         message: 'User role changed',
      };
   } catch (e) {
      console.log(e);
      return {
         ok: false,
         message: 'Error changing user role',
      };
   }
};
