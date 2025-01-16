import React from 'react';

import {Pi1, Pi2, Pi3, Pi4, Pi5} from '../../asset/icons/pi';

const Query = ({lang}) => {
  const benefits = [
    {
      icon: Pi1,
      title: lang.t_100_percent_eco_friendly_100_percent_biodegradable,
      description: lang.our_packaging,
    },
    {
      icon: Pi2,
      title: lang.fast_turn_around_5_7_days_delivery,
      description: lang.efficient_production,
    },
    {
      icon: Pi3,
      title: lang.delivered_at_your_doorstep_in_doha,
      description: lang.we_deliver,
    },
    {
      icon: Pi4,
      title: lang.premium_quality_printing,
      description: lang.durable_food_safe,
    },
    {
      icon: Pi5,
      title: lang.upload_your_artwork,
      description: lang.tailored_packaging,
    },
  ];

  return (
    <section className="w-full ">
      <div className=" text-center py-7 md:py-12">
        <h3 className="text-4xl mb-8 md:mb-16">{lang.why_papercut}</h3>
        <div className="flex flex-wrap gap-x-8 gap-y-11 justify-around items-start">
          {benefits.map(({icon: Icon, title, description}, index) => (
            <div
              key={index}
              className="paperBlock flex flex-col max-w-52 items-center gap-4 md:gap-7">
              <Icon className="w-14 h-14" />
              <h6 className="text-base md:text-[22px] w-full font-bold">
                {title}
              </h6>
              <p className="text-sm md:text-base font-normal">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Query;
