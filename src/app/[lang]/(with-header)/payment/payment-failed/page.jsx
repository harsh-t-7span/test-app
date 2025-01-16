import React from 'react';
import {getLocales} from '../../../../../../get-locales';
import PaymentFailedWrapper from './payment-failed-wrapper';

const page = async ({params}) => {
  const {lang} = params;
  const lan = await getLocales(lang);
  return (
    <>
      <PaymentFailedWrapper lang={lan} />
    </>
  );
};

export default page;
