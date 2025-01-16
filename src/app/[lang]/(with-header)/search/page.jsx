import React from 'react';
import SearchWrapper from './search-wrapper';
import {getLocales} from '../../../../../get-locales';

const page = async ({params}) => {
  const {lang} = params;

  const lan = await getLocales(lang);
  return (
    <>
      <SearchWrapper lang={lan} />
    </>
  );
};

export default page;
