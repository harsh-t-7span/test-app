import React from 'react';
import ShippingAddressWrapper from './shipping-address-wrapper';
import PreFooter from '@/components/PreFooter/preFooter';
import {getLocales} from '../../../../../get-locales';

const page = async ({params}) => {
  const {lang} = params;
  const lan = await getLocales(lang);
  return (
    <>
      <ShippingAddressWrapper lang={lan} />
      <PreFooter lang={lan} />
    </>
  );
};

export default page;
