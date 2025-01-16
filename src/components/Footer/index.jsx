import React from 'react';
import FooterWrapper from './footer-wrapper';
import {get} from '@/lib/utils';

const Footer = async ({lang}) => {
  const BASE_URL = process.env.PAPERCUT_API_BASE_URL;

  const link = (await get(`${BASE_URL}topmenu`)) || [];

  return (
    <>
      <FooterWrapper link={link} lang={lang} />
    </>
  );
};

export default Footer;
