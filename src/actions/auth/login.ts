'use server';

import { signIn } from '@/auth.config';

export async function authenticate(
   prevState: string | undefined,
   formData: FormData
) {
   try {
      await signIn('credentials', {
         ...Object.fromEntries(formData),
         redirect: false,
      });

      return 'Success';
   } catch (error) {
      if ((error as any).type === 'CredentialsSignin') {
         return 'Credenciales incorrectas';
      }

      return 'Error desconocido';
   }
}

export const login = async (email: string, password: string) => {
   try {
      await signIn('credentials', {
         email,
         password,
      });

      return {
         ok: true,
         message: 'Success',
      };
   } catch (e) {
      console.log(e);
      return {
         ok: false,
         message: 'Error desconocido',
      };
   }
};
