import React from 'react';
import ResetPasswordWrapper from './reset-password-wrapper';
import {getLocales} from '../../../../../get-locales';

const page = async ({params}) => {
  const lang = await getLocales(params.lang);

  return <ResetPasswordWrapper lang={lang} />;
};

export default page;
