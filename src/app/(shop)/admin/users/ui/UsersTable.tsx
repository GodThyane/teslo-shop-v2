'use client';

import React from 'react';
import { User } from '@/interfaces/user.interface';
import { changeUserRole } from '@/actions/users/change-user-role';

interface Props {
   users: User[];
}

const getUserNumberId = (id: string) => {
   return parseInt(id, 16);
};

const UsersTable = ({ users }: Props) => {
   return (
      <table className="min-w-full">
         <thead className="bg-gray-200 border-b">
            <tr>
               <th
                  scope="col"
                  className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
               >
                  #ID
               </th>
               <th
                  scope="col"
                  className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
               >
                  Email
               </th>
               <th
                  scope="col"
                  className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
               >
                  Nombre
               </th>
               <th
                  scope="col"
                  className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
               >
                  Role
               </th>
            </tr>
         </thead>
         <tbody>
            {users.map((user) => (
               <tr
                  className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                  key={user.id}
               >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                     {getUserNumberId(user.id)}
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                     {user.email}
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                     {user.name}
                  </td>
                  <td className="flex items-center text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                     <select
                        value={user.role}
                        onChange={(e) =>
                           changeUserRole(user.id, e.target.value)
                        }
                        className="text-sm w-full p-2 text-gray-900"
                     >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                     </select>
                  </td>
               </tr>
            ))}
         </tbody>
      </table>
   );
};

export default UsersTable;
