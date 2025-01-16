import React from 'react';
import ProfileWrapper from './profile-wrapper';
import {getLocales} from '../../../../../get-locales';

const page = async ({params}) => {
  const {lang} = params;

  const lan = await getLocales(lang);

  return (
    <>
      <ProfileWrapper lang={lan} />
    </>
  );
};

export default page;
