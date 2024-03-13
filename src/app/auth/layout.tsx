import React from 'react';
import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';

export default async function AuthLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <main className="min-h-screen flex justify-center items-center">
         <div className="w-full sm:w-[350px] px-10 sm:px-0">{children}</div>
      </main>
   );
}
