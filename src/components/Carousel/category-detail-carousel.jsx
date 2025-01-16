'use client';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import {cn} from '@/lib/utils';
import {useEffect, useState} from 'react';

const getDots = (dots, totalSlides) => {
  if (totalSlides <= 3) {
    return dots;
  }
  return dots.slice(0, 3);
};

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  swipeToSlide: true,
  touchThreshold: 10,
  slidesToShow: 4,
  slidesToScroll: 1,
  arrows: false,
  vertical: true,
  verticalSwiping: true,
  customPaging: i => (
    <div className="slick-dot w-2 h-2 bg-gray-500 rounded-full"></div>
  ),
  appendDots: dots => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        gap: '8px',
      }}>
      {getDots(dots)}
    </div>
  ),
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 5,
        vertical: false,
        verticalSwiping: false,
      },
    },
    {
      breakpoint: 450,
      settings: {
        slidesToShow: 4,
        vertical: false,
        verticalSwiping: false,
      },
    },
  ],
};

export default function CategoryDetailCarousel({
  carouselImage = [],
  apiProductImages = [],
}) {
  const apiImages = apiProductImages.map(image => ({
    src: image.thumbnail || image.original,
  }));

  const images = apiImages.length > 0 ? apiImages : carouselImage;

  const [selectedImage, setSelectedImage] = useState(images[0]);

  const handleImageClick = item => {
    setSelectedImage(item);
  };

  useEffect(() => {
    setSelectedImage(images[0]);
  }, [apiProductImages, carouselImage]);

  return (
    <div className="container flex flex-col justify-normal sm:flex-row-reverse sm:justify-center gap-5 p-0">
      <div className="h-full w-full md:relative md:h-auto lg:max-h-[500px]">
        {selectedImage && (
          <Image
            src={selectedImage?.src}
            alt="product image selected"
            height={800}
            width={800}
            className="h-full object-cover md:absolute md:inset-0 md:z-10"
          />
        )}
      </div>
      <div>
        <Slider {...settings} className="category-detail-slider">
          {images.map((item, index) => (
            <div
              key={index}
              onClick={() => handleImageClick(item)}
              className="size-20 sm:size-24 md:w-28 md:h-32 lg:w-24 lg:h-28 aspect-square">
              <Image
                src={item.src}
                alt="product image"
                width={780}
                height={200}
                className={cn('h-full object-cover object-center')}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
