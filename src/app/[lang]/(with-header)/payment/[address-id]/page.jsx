import React from 'react';
import PaymentWrapper from './payment-wrapper';
import {getLocales} from '../../../../../../get-locales';
import PreFooter from '@/components/PreFooter/preFooter';

const page = async ({params}) => {
  const {lang, 'address-id': addressID} = params;

  const lan = await getLocales(lang);
  return (
    <>
      <PaymentWrapper addressID={addressID} lang={lan} />
      <PreFooter lang={lan} />
    </>
  );
};

export default page;
