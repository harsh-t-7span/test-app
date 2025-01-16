import React from 'react';
import WishlistWrapper from './wish-list-wrapper';
import {getLocales} from '../../../../../get-locales';

const page = async ({params}) => {
  const {lang} = params;

  const lan = await getLocales(lang);

  return (
    <>
      <WishlistWrapper lan={lan} />
    </>
  );
};

export default page;
