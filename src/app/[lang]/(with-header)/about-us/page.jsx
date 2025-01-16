import React from 'react';
import {getLocales} from '../../../../../get-locales';
import AboutUsWrapper from './about-us-wrapper';

export const metadata = {
  title: 'About Us - PaperCut',
  description: 'The New Species of Nature-Friendly Products',
};

const page = async ({params}) => {
  const {lang} = params;
  const lan = await getLocales(lang);

  return <AboutUsWrapper lang={lan} />;
};

export default page;
