'use server';

import { prisma } from '@/lib/prisma';

export const getUserAddress = async (id: string) => {
   try {
      const address = await prisma.userAddress.findFirst({
         where: {
            userId: id,
         },
      });

      if (!address) {
         return {
            ok: false,
            message: 'No se encontró la dirección del usuario.',
         };
      }

      const { id: addressId, userId, countryId: country, ...rest } = address;

      return {
         ok: true,
         address: {
            ...rest,
            country,
         },
      };
   } catch (e) {
      console.log(e);
      return {
         ok: false,
         message: 'Error al obtener la dirección del usuario.',
      };
   }
};
