import Title from '@/components/ui/title/Title';
import React from 'react';
import { auth } from '@/auth.config';

const ProfilePage = async () => {
   const session = await auth();

   return (
      <div>
         <Title title="Perfil"></Title>
         <pre>{JSON.stringify(session?.user, null, 2)}</pre>
         <h3 className="text-3xl mb-3">{session?.user.role}</h3>
      </div>
   );
};

export default ProfilePage;
