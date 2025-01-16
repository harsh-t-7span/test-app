import React from 'react';
import PreFooter from '@/components/PreFooter/preFooter';
import {get} from '@/lib/utils';
import CategoryDetailsWrapper from './category-details-wrapper';
import {getLocales} from '../../../../../../../../get-locales';

const page = async ({params}) => {
  const {lang, 'item-id': itemId, 'product-id': productSlug} = params;

  const lan = await getLocales(lang);

  // const BASE_URL = process.env.PAPERCUT_API_BASE_URL;

  // const productDetails =
  //   (await get(`${BASE_URL}products/details/${productSlug}`)) || [];

  return (
    <>
      <CategoryDetailsWrapper
        params={params}
        // productDetails={productDetails}
        productId={itemId}
        lang={lan}
        productSlug={productSlug}
      />
      <PreFooter lang={lan} />
    </>
  );
};

export default page;
