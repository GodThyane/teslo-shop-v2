'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import clsx from 'clsx';
import { registerUser } from '@/actions/auth/register';
import { IoInformationOutline } from 'react-icons/io5';
import { login } from '@/actions/auth/login';

type FormInputs = {
   name: string;
   email: string;
   password: string;
};

const RegisterForm = () => {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<FormInputs>();

   const [errorMessage, setErrorMessage] = useState('');
   const [loading, setLoading] = useState(false);

   const onSubmit: SubmitHandler<FormInputs> = async (data: FormInputs) => {
      setLoading(true);
      setErrorMessage('');
      const { name, email, password } = data;
      const res = await registerUser(name, email, password);

      if (!res.ok) {
         setErrorMessage(res.message);
         setLoading(false);
         return;
      }

      await login(email.toLowerCase(), password);
      window.location.replace('/');
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
         <div className="mb-4 flex flex-col">
            <label htmlFor="name">Nombre completo</label>
            <input
               className={clsx('px-5 py-2 border bg-gray-200 rounded mb-1', {
                  'border-red-500': errors.name,
               })}
               type="text"
               autoFocus
               {...register('name', {
                  required: true,
               })}
            />
            {errors.name?.type === 'required' && (
               <span className="text-sm text-red-500">
                  El nombre es requerido
               </span>
            )}
         </div>

         <div className="mb-4 flex flex-col">
            <label htmlFor="email">Correo electrónico</label>
            <input
               className={clsx('px-5 py-2 border bg-gray-200 rounded mb-1', {
                  'border-red-500': errors.email,
               })}
               type="email"
               {...register('email', {
                  required: true,
                  pattern: /^\S+@\S+$/i,
               })}
            />

            {errors.email?.type === 'required' && (
               <span className="text-sm text-red-500">
                  El correo es requerido
               </span>
            )}
            {errors.email?.type === 'pattern' && (
               <span className="text-sm text-red-500">
                  El correo no es válido
               </span>
            )}
         </div>

         <div className="mb-4 flex flex-col">
            <label htmlFor="password">Contraseña</label>
            <input
               className={clsx('px-5 py-2 border bg-gray-200 rounded mb-1', {
                  'border-red-500': errors.password,
               })}
               type="password"
               {...register('password', {
                  required: true,
               })}
            />
            {errors.password?.type === 'required' && (
               <span className="text-sm text-red-500">
                  La contraseña es requerida
               </span>
            )}
         </div>

         {/* Error message */}
         <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
         >
            {errorMessage && (
               <div className="flex flex-row mb-2">
                  <IoInformationOutline size={20} className="text-red-500" />
                  <p className="text-sm text-red-500">{errorMessage}</p>
               </div>
            )}
         </div>

         <button
            disabled={loading}
            className={clsx({
               'btn-primary': !loading,
               'btn-disabled': loading,
            })}
         >
            Registrar
         </button>

         {/* divisor line */}
         <div className="flex items-center my-5">
            <div className="flex-1 border-t border-gray-500"></div>
            <div className="px-2 text-gray-800">O</div>
            <div className="flex-1 border-t border-gray-500"></div>
         </div>
         <div className="flex flex-col justify-center items-center">
            <span className={'text-sm mb-2'}>¿Ya tienes una cuenta?</span>

            <Link
               href="/auth/login"
               className="btn-secondary text-center w-full"
            >
               Iniciar sesión
            </Link>
         </div>
      </form>
   );
};

export default RegisterForm;
