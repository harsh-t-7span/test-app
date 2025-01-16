import React from 'react';
import OrderDetailsWrapper from './order-details-wrapper';
import {getLocales} from '../../../../../../../get-locales';
import {get} from '@/lib/utils';

const page = async ({params}) => {
  const {lang, 'order-id': orderId} = params;

  const BASE_URL = process.env.PAPERCUT_API_BASE_URL;

  const orderDetails = (await get(`${BASE_URL}orders/${orderId}`)) || [];

  const lan = await getLocales(lang);

  return (
    <>
      <OrderDetailsWrapper lang={lan} orderDetail={orderDetails} />
    </>
  );
};

export default page;
