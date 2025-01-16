import React from 'react';
import {getLocales} from '../../../../../../get-locales';
import PaymentCancelledWrapper from './payment-cancelled-wrapper';

const page = async ({params}) => {
  const {lang} = params;
  const lan = await getLocales(lang);

  return (
    <>
      <PaymentCancelledWrapper lang={lan} />
    </>
  );
};

export default page;
