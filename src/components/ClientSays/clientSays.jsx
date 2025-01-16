import React from 'react';
import Image from 'next/image';
import clientImg from './../../../public/images/client.png';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ClientSays = ({lang}) => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    arrows: false,
  };

  const testimonials = [
    {
      title: 'What Our Client Says 1',
      description:
        'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.',
      name: 'John Doe (General Manager)',
      image: clientImg,
    },
    {
      title: 'What Our Client Says 2',
      description:
        'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.',
      name: 'John Doe (General Manager)',
      image: clientImg,
    },
    {
      title: 'What Our Client Says 3',
      description:
        'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.',
      name: 'John Doe (General Manager)',
      image: clientImg,
    },
    {
      title: 'What Our Client Says 4',
      description:
        'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.',
      name: 'John Doe (General Manager)',
      image: clientImg,
    },
  ];
  return (
    <div className="bg-[url('../../asset/clientsaysbanner.svg')] bg-cover">
      <div className="container py-20">
        <div
          className={`w-full h-full flex items-center max-w-md lg:max-w-lg ${
            lang.lang == 'ar' ? 'mr-auto' : ''
          } `}>
          <Slider {...settings} className="w-full testimonial-slider flex">
            {testimonials.map((testimonial, index) => (
              <div
                className="w-full flex flex-col items-start text-black"
                key={index}>
                <Image
                  src={testimonial.image}
                  width={100}
                  height={100}
                  alt="profile pic"
                  className="rounded-full shadow-lg mb-7 md:mb-14"
                />
                <h6 className="text-base md:text-lg mb-8 md:mb-10">
                  {testimonial.title}
                </h6>
                <p className="text-lg lg:text-2xl leading-7 lg:leading-9 mb-4 md:mb-7">
                  {testimonial.description}
                </p>
                <small className="text-sm md:text-base">
                  {testimonial.name}
                </small>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default ClientSays;
