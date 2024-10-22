'use client';
import Container from '~/core/ui/Container';
import Divider from '~/core/ui/Divider';
import Heading from '~/core/ui/Heading';
import SubHeading from '~/core/ui/SubHeading';
import PricingTable from '~/components/PricingTable';
import CarouselSection from './components/CarouselSection';
import Button from '~/core/ui/Button';
import { ChevronRight } from 'lucide-react';
import { ScrollArea, ScrollBar } from '~/core/ui/scroll-area';
import { useEffect, useState } from 'react';
import { CategoryProps } from '~/lib/interfaces/products';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [categories, setCategories] = useState<CategoryProps[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`https://dummyjson.com/products/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categoryImages = [
    '/images/image1.jpg', // Path to your first static image
    '/images/image2.jpg', // Path to your second static image
    '/images/image3.jpg', // Path to your third static image
    '/images/image4.jpg', // Path to your fourth static image
  ];

  return (
    <div className={'flex flex-col space-y-16 bg-primary-100'}>
      <div className="mt-4">
        <CarouselSection />
      </div>

      <Container>
        <div className="flex flex-row justify-between mb-4">
          <Heading type={3}>Top Picks For You</Heading>
          <Button variant={'link'}>
            View All
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4  gap-4 justify-center">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className=" rounded-lg  shadow-lg flex flex-col space-y-2 bg-gray-100 overflow-hidden pb-4 "
            >
              <div className="bg-black h-24 md:h-36">Image</div>
              <div className="text-sm md:text-base font-bold px-2">
                True Wireless Earbuds
              </div>
              <div className="flex flex-row px-2 justify-between items-center">
                <div className="flex flex-col">
                  <div className="text-sm md:text-base font-bold">
                    Rs. 2,229
                  </div>
                  <div className="text-sm text-green-600 font-semibold">
                    20%off
                  </div>
                </div>
                <Button size={'sm'} className="h-8">
                  Buy Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Container>

      <Container>
        <div className="flex flex-row justify-between mb-4">
          <Heading type={3}>Shop by Categories</Heading>
          <Button variant={'link'}>
            View All
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        <ScrollArea className="w-full">
          <div className="flex flex-row gap-4">
            {categories &&
              categories.map((item, i) => (
                <Link
                  href={`/category/${item.slug}`}
                  key={i}
                  className=" rounded-lg shadow-lg space-y-2 flex flex-col mb-4 bg-white pb-4 w-60 h-60"
                >
                  <div className="relative h-80 w-full">
                    <Image
                      src="/assets/images/posts/lorem-ipsum.webp" 
                      alt="category-img"
                      fill 
                      objectFit="cover" 
                      className="rounded-t-lg"
                    />
                  </div>

                  <div className="font-bold text-center">{item.name}</div>
                </Link>
              ))}
          </div>
          <ScrollBar orientation="horizontal" className="" />
        </ScrollArea>
      </Container>

      <Container>
        <div className="flex flex-row justify-between mb-4">
          <Heading type={3}>Explore Bestsellers</Heading>
          <Button variant={'link'}>
            View All
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
        <ScrollArea className="w-full ">
          <div className="flex flex-row gap-4  ">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className=" rounded-lg shadow-lg  mb-4 flex flex-col space-y-2 bg-white overflow-hidden pb-4 "
              >
                <div className="bg-black h-60 w-60">Image</div>
                <div className="font-bold text-center">
                  True Wireless Earbuds
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="" />
        </ScrollArea>
      </Container>

      <Divider />

      <Container>
        <div
          className={
            'flex flex-col items-center justify-center py-16 space-y-16'
          }
        >
          <div className={'flex flex-col items-center space-y-8 text-center'}>
            <div className={'flex flex-col space-y-2.5'}>
              <Heading type={2}>
                Ready to take your SaaS business to the next level?
              </Heading>

              <SubHeading as={'h3'}>
                Get started on our free plan and upgrade when you are ready.
              </SubHeading>
            </div>
          </div>

          <div className={'w-full'}>
            <PricingTable />
          </div>
        </div>
      </Container>
    </div>
  );
}
