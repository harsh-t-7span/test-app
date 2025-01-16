import Image from 'next/image';
import React from 'react';
import modernityImg from '/public/images/modernity.svg';
import {Button} from '..';

const ModernityBend = ({lang}) => {
  return (
    <section className="mainBnr">
      <div className="bnrTxt pt-5 lg:pt-20">
        <div className="container customContainer">
          <h2 className="text-xl lg:text-3xl font-extrabold mb-2">
            {lang.modernity_blends_with_nature ||
              'Modernity Blends with Nature'}
            <br /> {lang.nature || 'Nature'}
          </h2>
          <Button variant="secondary">{lang.shop_now || 'Shop Now'}</Button>
        </div>
      </div>
      <Image
        width={1920}
        height={526}
        src={modernityImg}
        alt=""
        className="h-64 md:h-80 lg:h-[400px] 2xl:h-[600px] object-cover"
      />
    </section>
  );
};

export default ModernityBend;
