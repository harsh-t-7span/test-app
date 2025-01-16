'use client';
import React from 'react';
import PreFooter from '@/components/PreFooter/preFooter';
import {getLocales} from '../../../../../get-locales';
import ReturnWrapper from './return-wrapper';

const page = async ({params}) => {
  const {lang} = params;
  const lan = await getLocales(lang);
  return (
    <>
      <ReturnWrapper />
      <PreFooter lang={lan} />
    </>
  );
};

export default page;
