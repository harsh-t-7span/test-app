'use client';

import ClientSays from '@/components/ClientSays/clientSays';
import FeaturedProducts from '@/components/FeaturedProducts/featuredProducts';
import PreFooter from '@/components/PreFooter/preFooter';
import Query from '@/components/Query/Query';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {useRouter} from 'next/navigation';
import {useSelector} from 'react-redux';
import {ArrowRight, MoveRight} from 'lucide-react';

const HomeComponent = ({lang}) => {
  const [isMounted, setIsMounted] = useState(false);
  const {customer, isLoggedIn} = useSelector(state => state.customerData);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col">
      <section className="h-[300px] md:h-[400px] lg:h-[500px] bg-[url('../../asset/banner.svg')] bg-cover bg-center">
        <div className="container mx-auto px-4 py-8 md:py-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            {lang.future_of_sustainability}
          </h2>
          <p className="mb-4 text-sm sm:text-base font-semibold">
            {lang.on_all_our_eco_friendly_pla_cups_and_containers}
          </p>
          <Button
            variant="secondary"
            className="mt-3 lg:mt-5 px-6 py-3 rounded-lg">
            {lang.shop_now}
          </Button>
        </div>
      </section>

      <div className="w-full my-2">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 relative">
          <div className="bg-[url('../../asset/banner2.svg')] bg-cover bg-center h-[300px] md:min-h-[400px] lg:min-h-[500px]"></div>
          <div className="bg-[url('../../asset/banner3.svg')] bg-cover bg-center h-[300px] md:min-h-[400px] lg:min-h-[500px]"></div>

          <div className="absolute w-full h-full">
            <div className="w-full flex flex-col md:flex-row justify-between container h-full">
              <div
                className={`pt-14 ${lang?.lang == 'ar' ? '' : 'text-white'}`}>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 max-w-56">
                  {lang.custom_print || 'Custom Print Made Easy!'}
                </h1>
                <a
                  href="#"
                  className="inline-flex items-center font-medium hover:underline">
                  {lang.see_details || 'See Details'}{' '}
                  <span
                    className={`ml-2 bg-primary rounded-full p-1 flex items-center justify-center w-6 h-6 ${
                      lang?.lang == 'ar' ? 'mr-2' : ''
                    }`}>
                    <ArrowRight />
                  </span>
                </a>
              </div>
              <div
                className={`max-w-60 md:text-right pb-36 md:pb-0 md:pt-14 ${
                  lang?.lang == 'ar' ? '' : 'md:ml-auto'
                }`}>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {lang.personalize_your_branding ||
                    'Personalize Your Branding'}
                </h1>
                <a
                  href="#"
                  className="inline-flex items-center font-medium hover:underline">
                  {lang.see_details || 'See Details'}{' '}
                  <span
                    className={`ml-2 bg-primary rounded-full p-1 flex items-center justify-center w-6 h-6 text-white ${
                      lang?.lang == 'ar' ? 'mr-2' : ''
                    }`}>
                    <ArrowRight />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <Query lang={lang} />
      </div>

      <section className="h-[500px] bg-[url('../../asset/packaging.svg')] bg-cover bg-center">
        <div className="container mx-auto px-4 mt-16 lg:mt-24">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
              {lang.sugarcane_pulp_packaging}
            </h2>
            <p className="mb-4 text-sm sm:text-base font-semibold">
              {lang.we_believe_in_crafting_the_awe_inspiring}
            </p>
            <Button variant="secondary" className="mt-3 lg:mt-5">
              {lang.shop_now}
            </Button>
          </div>
        </div>
      </section>

      <PreFooter lang={lang} />

      <FeaturedProducts lang={lang} />

      <div>
        <ClientSays lang={lang} />
      </div>

      <div className="w-full my-2">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 relative">
          <div className="bg-[url('../../asset/natureProduct.svg')] bg-cover bg-center h-[300px] md:min-h-[400px] lg:min-h-[500px]"></div>
          <div className="bg-[url('../../asset/clothingTag.svg')] bg-cover bg-center h-[300px] md:min-h-[400px] lg:min-h-[500px]"></div>

          <div className="absolute w-full h-full">
            <div className="w-full flex flex-col md:flex-row justify-between container h-full">
              <div className="pt-14">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {lang.nature_friendly}
                  <br />
                  {lang.products}
                </h1>
                <a
                  href="#"
                  className="inline-flex items-center font-medium hover:underline">
                  {lang.see_details || 'See Details'}{' '}
                  <span
                    className={`ml-2 bg-primary rounded-full p-1 flex items-center justify-center w-6 h-6 ${
                      lang?.lang == 'ar' ? 'mr-2' : ''
                    }`}>
                    <ArrowRight />
                  </span>
                </a>
              </div>
              <div
                className={`text-white max-w-60 md:text-right pb-36 md:pb-0 md:pt-14 ${
                  lang?.lang == 'ar' ? '' : 'md:ml-auto'
                }`}>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {lang.personalize_your_branding ||
                    'Personalize Your Branding'}
                </h1>
                <a
                  href="#"
                  className="inline-flex items-center font-medium hover:underline">
                  {lang.see_details || 'See Details'}{' '}
                  <span
                    className={`ml-2 bg-primary rounded-full p-1 flex items-center justify-center w-6 h-6 text-white ${
                      lang?.lang == 'ar' ? 'mr-2' : ''
                    }`}>
                    <ArrowRight />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeComponent;
