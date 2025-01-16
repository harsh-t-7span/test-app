import React from 'react';
import ContactUsWrapper from './contact-us-wrapper';
import PreFooter from '@/components/PreFooter/preFooter';
import {getLocales} from '../../../../../get-locales';

const page = async ({params}) => {
  const {lang} = params;

  const lan = await getLocales(lang);

  return (
    <>
      <ContactUsWrapper lang={lan} />
      <PreFooter lang={lan} />
    </>
  );
};

export default page;
