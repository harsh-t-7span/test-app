import React from 'react';
import {getLocales} from '../../../../../get-locales';
import SignupWrapper from './sign-up-wrapper';

const page = async ({params}) => {
  const lang = await getLocales(params.lang);

  return (
    <>
      <SignupWrapper lang={lang} />
    </>
  );
};

export default page;
