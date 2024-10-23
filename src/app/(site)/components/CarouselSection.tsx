'use client';
import React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/core/ui/Carousel';
import Image from 'next/image';

const carouselItems = [
  {
    url: '/assets/images/banner.jpg',
    link: '/category/fragrances',
  },
  {
    url: '/assets/images/banner.jpg',
    link: '/category/skincare',
  },
  {
    url: '/assets/images/banner.jpg',
    link: '/category/makeup',
  },
  {
    url: '/assets/images/banner.jpg',
    link: '/category/haircare',
  },
  {
    url: '/assets/images/banner.jpg',
    link: '/category/bodycare',
  },
];

const CarouselSection = () => {
  return (
    <div>
      <Carousel
        className="w-full"
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
      >
        <CarouselContent>
          {carouselItems.map((item, index) => (
            <CarouselItem key={index}>
              <div className="relative p-1 h-96 w-full">
                <a href={item.link} onClick={(e) => e.stopPropagation()}>
                  <Image
                    src={item.url}
                    alt={`Image ${index + 1}`}
                    layout="fill" // Use layout="fill" instead of fill
                    objectFit="cover"
                    className="rounded-t-lg"
                    priority
                  />
                </a>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:block" />
        <CarouselNext className="hidden md:block" />
      </Carousel>
    </div>
  );
};

export default CarouselSection;
