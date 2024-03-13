export const dynamic = 'force-dynamic';
export const revalidate = 0;

import UsersTable from '@/app/(shop)/admin/users/ui/UsersTable';

import React from 'react';
import Link from 'next/link';
import Title from '@/components/ui/title/Title';
import Pagination from '@/components/ui/pagination/Pagination';
import { getPaginatedUsers } from '@/actions/users/get-paginated-users';

interface Props {
   searchParams: {
      page?: string;
   };
}

const UsersAdminPage = async ({ searchParams }: Props) => {
   const page = searchParams.page ? parseInt(searchParams.page) : 1;

   const { totalPages, users } = await getPaginatedUsers({ page });

   if (users.length === 0) {
      return (
         <div className="flex flex-col justify-center items-center h-[calc(100vh-113px)]">
            <p className="text-2xl font-light">No hay usuarios</p>
            {/*Link a home*/}
            <Link
               href={'/'}
               className="font-normal hover:underline transition-all text-blue-600"
            >
               Regresar al inicio
            </Link>
         </div>
      );
   }

   return (
      <>
         <Title title="Usuarios" subTitle="Mantenimiento de usuarios" />

         <div className="mb-10">
            <UsersTable users={users}></UsersTable>
         </div>

         <Pagination totalPages={totalPages} />
      </>
   );
};

export default UsersAdminPage;
