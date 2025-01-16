'use client';
import React from 'react';
import PreFooter from '@/components/PreFooter/preFooter';
import {getLocales} from '../../../../../get-locales';
import PrivacyWrapper from './privacy-wrapper';

const page = async ({params}) => {
  const {lang} = params;
  const lan = await getLocales(lang);
  return (
    <>
      <PrivacyWrapper />
      <PreFooter lang={lan} />
    </>
  );
};

export default page;
