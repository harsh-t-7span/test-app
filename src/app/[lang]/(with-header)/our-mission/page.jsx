import React from 'react';
import OurMissionWrapper from './our-mission-wrapper';
import PreFooter from '@/components/PreFooter/preFooter';
import {getLocales} from '../../../../../get-locales';

const page = async ({params}) => {
  const {lang} = params;
  const lan = await getLocales(lang);

  return (
    <>
      <OurMissionWrapper />
      <PreFooter lang={lan} />
    </>
  );
};

export default page;
