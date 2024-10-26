'use client';
import React, { useEffect, useState } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/core/ui/Carousel';
import Image from 'next/image';

// Define an interface for the banner data
interface Banner {
  banner_id: string;
  title: string;
  image_url: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  category_id: string;
}

// Skeleton loader component for carousel items
const SkeletonLoader = () => (
  <div className="relative p-1 h-96 w-full animate-pulse bg-gray-300 rounded-lg">
    <div className="absolute inset-0 bg-gray-200"></div>
  </div>
);

const CarouselSection: React.FC = () => {
  const [carouselItems, setCarouselItems] = useState<Banner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('/api/banner');
        if (!response.ok) {
          throw new Error('Failed to fetch banners');
        }
        const data = await response.json();
        setCarouselItems(data.data);
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

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
          {loading
            ? // Display skeletons while loading
              Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index}>
                  <SkeletonLoader />
                </CarouselItem>
              ))
            : // Display carousel items after loading
              carouselItems.map((item) => (
                <CarouselItem key={item.banner_id}>
                  <div className="relative p-1 h-96 w-full">
                    <a
                      href={`/category/${item.category_id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Image
                        src={item.image_url}
                        alt={item.title || 'Banner Image'}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg"
                        priority
                      />
                    </a>
                  </div>
                </CarouselItem>
              ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:block h-10 w-10 " />
        <CarouselNext className="hidden md:block h-10 w-10" />
      </Carousel>
    </div>
  );
};

export default CarouselSection;
