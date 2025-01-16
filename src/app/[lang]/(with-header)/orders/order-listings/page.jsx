import React from 'react';
import OrderListingsWrapper from './order-listings-wrapper';
import {getLocales} from '../../../../../../get-locales';

const page = async ({params}) => {
  const {lang} = params;

  const lan = await getLocales(lang);

  return (
    <>
      <OrderListingsWrapper lang={lan} />
    </>
  );
};

export default page;
