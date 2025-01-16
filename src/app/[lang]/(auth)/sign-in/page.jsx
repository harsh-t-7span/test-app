import React from 'react';
import {getLocales} from '../../../../../get-locales';
import Login from './sign-in-wrapper';

const page = async ({params}) => {
  const lang = await getLocales(params.lang);

  return (
    <>
      <Login lang={lang} />
    </>
  );
};

export default page;
