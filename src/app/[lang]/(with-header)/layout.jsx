import Header from '@/components/Header';
import {get} from '@/lib/utils';
import {getLocales} from '../../../../get-locales';
import Footer from '@/components/Footer';
import ClientData from './client-data';
export const dynamic = 'force-dynamic';
// import {cookies} from 'next/headers';

export default async function WithHeaderLayout({children, params}) {
  // const data = cookies().get('PAPERCUT_PROFILE');

  const BASE_URL = process.env.PAPERCUT_API_BASE_URL;
  const lang = await getLocales(params.lang);
  const categories = (await get(`${BASE_URL}categories/tree`)) || [];
  const currencies = (await get(`${BASE_URL}directory/currency`)) || {};
  const countries = (await get(`${BASE_URL}directory/countries`)) || [];
  const location = (await get('https://ipapi.co/json/')) || {};

  return (
    <div>
      <ClientData />
      <div className="sticky top-0 z-50 bg-white">
        <Header
          categories={categories}
          currencies={currencies}
          countries={countries}
          location={location}
          lang={lang}
          // customerData={customerData}
        />
      </div>

      {children}
      <Footer lang={lang} />
    </div>
  );
}
