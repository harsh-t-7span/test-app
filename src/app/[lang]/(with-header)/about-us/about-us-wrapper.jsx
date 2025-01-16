'use client';

import ModernityBend from '@/components/ModernityBend/ModernityBend';
import {Button} from '@/components/ui/button';
import Image from 'next/image';
import banner3 from '../../../../asset/about-us-banner-3.svg';
import {ArrowRight} from 'lucide-react';

const AboutUsWrapper = ({lang}) => {
  return (
    <>
      <section className="h-[300px] md:h-[400px] lg:h-[500px] bg-[url('../../asset/about-us-banner.svg')] bg-cover bg-center">
        <div className="container mx-auto px-4 py-8 md:py-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 max-w-96">
            {lang.the_new_way_to_success}
          </h2>

          <Button
            variant="secondary"
            className="mt-3 lg:mt-5 px-6 py-3 rounded-lg">
            {lang.learn_more}
          </Button>
        </div>
      </section>

      <div className="w-full my-2">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 relative">
          <div className="bg-[url('../../asset/about-us-banner-left.svg')] bg-cover bg-center h-[300px] md:min-h-[400px] lg:min-h-[500px]"></div>
          <div className="bg-[url('../../asset/about-us-banner-right.svg')] bg-cover bg-center h-[300px] md:min-h-[400px] lg:min-h-[500px]"></div>

          <div className="absolute w-full h-full">
            <div className="w-full flex flex-col md:flex-row justify-between container h-full">
              <div
                className={`pt-14 ${lang?.lang == 'ar' ? '' : 'text-white'}`}>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 max-w-96">
                  {lang.the_new_species ||
                    'The New Species of Nature-Friendly Products'}
                </h1>
                <a
                  href="#"
                  className="inline-flex items-center font-medium hover:underline">
                  {lang.see_details || 'See Details'}{' '}
                  <span className="ml-2 bg-primary rounded-full p-1 flex items-center justify-center w-6 h-6">
                    <ArrowRight />
                  </span>
                </a>
              </div>
              <div
                className={`md:text-right pb-36 md:pb-0 md:pt-14 ${
                  lang?.lang == 'ar' ? '' : 'md:ml-auto'
                }`}>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 max-w-96">
                  {lang.where_modernity_blends_with_nature ||
                    'Where Modernity Blends with Nature'}
                </h1>
                <a
                  href="#"
                  className="inline-flex items-center font-medium hover:underline">
                  {lang.see_details || 'See Details'}{' '}
                  <span className="ml-2 bg-primary rounded-full p-1 flex items-center justify-center w-6 h-6 text-white">
                    <ArrowRight />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="w-full pt-12 md:pt-24 lg:pt-28 pb-4 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-12 items-center">
            {/* Left Content */}
            <div className="flex flex-col justify-center space-y-4">
              <div>
                <h3 className="text-base md:text-4xl font-medium tracking-wide text-gray-800">
                  {lang.how_it_works || 'How It Works'}
                </h3>
                <h2 className="text-3xl font-semibold tracking-tighter sm:text-4xl md:text-5xl mt-4">
                  {lang.we_endeavour_to_serve_the_best_eco_packaging_service_there_is ||
                    'We Endeavour To Serve The Best Eco-Packaging Service There Is'}
                </h2>
                <p className="lg:max-w-[600px] text-gray-500 md:text-xl lg:text-base mt-7">
                  {lang.our_primary_agenda ||
                    'Our Primary Agenda Is To Deliver The Finest Class Of Packaging Services That Aptly Complies With The Requirements Of Our Clients. Needless To Say We Tend To Rely On The Eco-Friendly Means To Design Our Line Of Services. Customer Satisfaction And Nature Preservation Are Our Primary Concern And Also Our Central Driving Force.'}
                </p>
              </div>
              <div>
                <Button
                  variant="secondary"
                  className="mt-3 px-6 py-3 rounded-lg">
                  {lang.how_it_works || 'How It Works'}
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex justify-center lg:justify-end w-full lg:w-[40%] shrink-0">
              <div className="relative max-h-[300px] md:max-h-[400px] w-full max-w-[500px] lg:h-[600px]">
                <Image
                  src={banner3}
                  alt="Eco-friendly packaging materials including cardboard containers and wooden utensils"
                  width={1920}
                  height={526}
                  className="object-cover w-full h-full"
                />
                {/* <img src={imgPath}></img> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ModernityBend lang={lang} />
    </>
  );
};

export default AboutUsWrapper;
