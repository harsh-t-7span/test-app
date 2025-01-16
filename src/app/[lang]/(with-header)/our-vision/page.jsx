import React from 'react';
import OurVisionWrapper from './our-vision-wrapper';
import {getLocales} from '../../../../../get-locales';
import PreFooter from '@/components/PreFooter/preFooter';

const page = async ({params}) => {
  const {lang} = params;
  const lan = await getLocales(lang);
  return (
    <>
      <OurVisionWrapper />
      <PreFooter lang={lan} />
    </>
  );
};

export default page;
