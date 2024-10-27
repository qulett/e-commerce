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
import { CategoryProps, Product } from '~/lib/interfaces/products';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from './components/ProductCard';

export default function Home() {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProductsByCategory = async () => {
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
  const fetchProducts = async () => {
    try {
      const response = await fetch(`https://dummyjson.com/products?limit=12`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      console.log(data)
      setProducts(data.products);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProductsByCategory();
    fetchProducts();
  }, []);

  const categoryImages = [
    '/images/image1.jpg', // Path to your first static image
    '/images/image2.jpg', // Path to your second static image
    '/images/image3.jpg', // Path to your third static image
    '/images/image4.jpg', // Path to your fourth static image
  ];

  return (
    <div className={'flex flex-col space-y-16 bg-primary-100 w-full'}>
      <div className="w-full">
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
          {products && products.map((item, i) => (
             <ProductCard
             key={i}
             id={item.id}
             ratings={item.rating}
             imageUrl={item.images[0]}
             productName={item.title}
             discount={item.discountPercentage}
             price={item.price}
             />
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
            {products && products.map((item, i) => (
              <div
                key={i}
                className=" rounded-lg shadow-lg  mb-4 flex flex-col space-y-2 bg-white overflow-hidden pb-4 "
              >
                <div className="h-60 w-60 relative">
                  <Image 
                  src={item.images[0]}
                  alt='popular'
                  fill
                  objectFit="cover"
                  />
                </div>
                <div className="font-bold text-center px-3">
                  {item.title}
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="" />
        </ScrollArea>
      </Container>
    </div>
  );
}
