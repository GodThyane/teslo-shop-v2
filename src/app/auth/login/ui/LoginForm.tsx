'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/actions/auth/login';
import { IoInformationOutline } from 'react-icons/io5';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';

const LoginForm = () => {
   const [message, dispatch] = useFormState(authenticate, undefined);
   const searchParams = useSearchParams();

   useEffect(() => {
      if (message === 'Success') {
         const callBack = searchParams.get('callbackUrl');
         if (callBack) {
            const url = new URL(callBack);
            window.location.replace(url);
            return;
         }
         window.location.replace('/');
      }
   }, [message, searchParams]);

   return (
      <form action={dispatch} className="flex flex-col">
         <label htmlFor="email">Correo electrónico</label>
         <input
            className="px-5 py-2 border bg-gray-200 rounded mb-5"
            type="email"
            name="email"
         />

         <label htmlFor="password">Contraseña</label>
         <input
            className="px-5 py-2 border bg-gray-200 rounded mb-5"
            type="password"
            name="password"
         />
         <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
         >
            {message && message !== 'Success' && (
               <div className="flex flex-row mb-2">
                  <IoInformationOutline size={20} className="text-red-500" />
                  <p className="text-sm text-red-500">{message}</p>
               </div>
            )}
         </div>

         <LoginButton />

         {/* divisor line */}
         <div className="flex items-center my-5">
            <div className="flex-1 border-t border-gray-500"></div>
            <div className="px-2 text-gray-800">O</div>
            <div className="flex-1 border-t border-gray-500"></div>
         </div>

         <div className="flex flex-col justify-center items-center">
            <span className={'text-sm mb-2'}>¿No tienes una cuenta?</span>

            <Link
               href="/auth/new-account"
               className="btn-secondary text-center"
            >
               Crear una nueva cuenta
            </Link>
         </div>
      </form>
   );
};

function LoginButton() {
   const { pending } = useFormStatus();

   return (
      <button
         disabled={pending}
         type={'submit'}
         className={clsx({
            'btn-primary': !pending,
            'btn-disabled': pending,
         })}
      >
         Ingresar
      </button>
   );
}

export default LoginForm;
