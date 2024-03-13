'use server';

import { Address } from '@/interfaces/address.interface';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth.config';

export const setUserAddress = async (address: Address) => {
   try {
      const session = await auth();
      if (!session) {
         return {
            ok: false,
            message: 'Usuario no autenticado.',
         };
      }
      const id = session.user?.id;

      const newAddress = await createOrReplaceAddress(address, id);

      return {
         ok: true,
         address: newAddress,
      };
   } catch (e) {
      console.log(e);
      return {
         ok: false,
         message: 'Error al actualizar la dirección del usuario.',
      };
   }
};

export const deleteUserAddress = async () => {
   try {
      const session = await auth();
      if (!session) {
         return {
            ok: false,
            message: 'Usuario no autenticado.',
         };
      }
      const id = session.user?.id;

      await prisma.userAddress.delete({
         where: {
            userId: id,
         },
      });

      return {
         ok: true,
         message: 'Dirección eliminada correctamente.',
      };
   } catch (e) {
      console.log(e);
      return {
         ok: false,
         message: 'Error al eliminar la dirección del usuario.',
      };
   }
};

const createOrReplaceAddress = async (address: Address, userId: string) => {
   try {
      const storedAddress = await prisma.userAddress.findUnique({
         where: {
            userId,
         },
      });

      const { country: countryId, ...rest } = address;

      const addressToSave = {
         ...rest,
         userId,
         countryId,
      };

      if (!storedAddress) {
         // Return the new address
         return await prisma.userAddress.create({
            data: addressToSave,
         });
      }

      return await prisma.userAddress.update({
         where: {
            userId,
         },
         data: addressToSave,
      });
   } catch (e) {
      console.log(e);
      return {
         ok: false,
         message: 'Error al crear o actualizar la dirección del usuario.',
      };
   }
};

function getServerSession(authOptions: any) {
   throw new Error('Function not implemented.');
}
