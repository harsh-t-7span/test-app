import React from 'react';
import {getLocales} from '../../../../../../get-locales';
import PaymentSuccessWrapper from './payment-success-wrapper';

const page = async ({params}) => {
  const {lang} = params;

  const lan = await getLocales(lang);
  return (
    <>
      <PaymentSuccessWrapper lan={lan} />
    </>
  );
};

export default page;
