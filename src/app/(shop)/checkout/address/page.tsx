import { redirect } from 'next/navigation';

export const revalidate = 7257600; // 1 year

import Title from '@/components/ui/title/Title';
import AddressForm from '@/app/(shop)/checkout/address/ui/AddressForm';
import { getCountries } from '@/actions/country/get-countries';
import { Country } from '@/interfaces/country.interface';
import { getUserAddress } from '@/actions/address/get-user-address';
import { Address } from '@/interfaces/address.interface';
import { auth } from '@/auth.config';

const AddressPage = async () => {
   const countries: Country[] = await getCountries();

   const session = await auth();

   const { ok, address } = await getUserAddress(session?.user.id as string);

   if (!ok) {
      redirect('/checkout');
   }

   return (
      <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">
         <div className="w-full  xl:w-[1000px] flex flex-col justify-center text-left">
            <Title title="Dirección" subTitle="Dirección de entrega" />

            <AddressForm
               countries={countries}
               userStoredAddress={address as Address}
            />
         </div>
      </div>
   );
};

export default AddressPage;
