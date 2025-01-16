'use client';
import React from 'react';
import PreFooter from '@/components/PreFooter/preFooter';
import FaqWrapper from './faq-wrapper';
import {getLocales} from '../../../../../get-locales';

const page = async ({params}) => {
  const {lang} = params;
  const lan = await getLocales(lang);
  return (
    <>
      <FaqWrapper />
      <PreFooter lang={lan} />
    </>
  );
};

export default page;
