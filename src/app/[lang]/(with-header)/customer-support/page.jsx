'use client';
import React from 'react';
import {getLocales} from '../../../../../get-locales';
import PreFooter from '@/components/PreFooter/preFooter';

const CustomerSupport = async ({params}) => {
  const {lang} = params;
  const lan = await getLocales(lang);
  return (
    <>
      <section className="bg-primary-gradient">
        <div className="container min-h-[620px] py-12">
          <h1 className="text-2xl text-center font-bold mb-2">
            Customer Support
          </h1>
        </div>
      </section>
      <PreFooter lang={lan} />
    </>
  );
};

export default CustomerSupport;
