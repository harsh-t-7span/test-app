'use client';
import React from 'react';
import PreFooter from '@/components/PreFooter/preFooter';
import {getLocales} from '../../../../../get-locales';
import TermsWrapper from './terms-wrapper';

const page = async ({params}) => {
  const {lang} = params;
  const lan = await getLocales(lang);
  return (
    <>
      <TermsWrapper />
      <PreFooter lang={lan} />
    </>
  );
};

export default page;
