import React from 'react';
import TrackOrderWrapper from './track-order-wrapper';
import {get} from '@/lib/utils';
import {getLocales} from '../../../../../../../../../get-locales';

const page = async ({params, searchParams}) => {
  const {lang, 'order-id': orderID, 'tracking-id': trackingId} = params;

  const BASE_URL = process.env.PAPERCUT_API_BASE_URL;

  const orderDetails = (await get(`${BASE_URL}orders/${orderID}`)) || [];

  const trackingData =
    (await get(
      `${BASE_URL}fedex/track/?orderId=${orderID}&&trackingNumber=${trackingId}`,
    )) || [];

  const lan = await getLocales(lang);

  return (
    <>
      <TrackOrderWrapper
        lang={lan}
        trackingData={trackingData}
        orderDetails={orderDetails}
      />
    </>
  );
};

export default page;
