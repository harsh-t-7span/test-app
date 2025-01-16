import LogoIcon from '/public/images/logo.svg';

import React from 'react';
import Image from 'next/image';

const WithHeaderLoading = () => {
  return (
    <div className="fixed z-50 inset-0 backdrop-blur-lg flex justify-center items-center">
      <div className="h-24 animate-bounce">
        <Image
          src={LogoIcon}
          alt="logo"
          width={500}
          height={500}
          className="h-16"
        />
      </div>
    </div>
  );
};

export default WithHeaderLoading;
