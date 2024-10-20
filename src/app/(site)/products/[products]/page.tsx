'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Radio,
  RadioGroup,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react';
import Image from 'next/image';
import { HeartIcon, StarIcon } from 'lucide-react';

type Dimensions = {
  width: number;
  height: number;
  depth: number;
};

type Meta = {
  createdAt: string;
  updatedAt: string;
};

type Review = {
  rating: number;
  comment: string;
  date: string;
};

type Product = {
  id: number;
  title: string;
  price: number;
  discountPercentage: number;
  description: string;
  category: string;
  brand: string;
  availabilityStatus: string;
  minimumOrderQuantity: number;
  dimensions: Dimensions;
  weight: number;
  rating: number;
  stock: number;
  shippingInformation: string;
  returnPolicy: string;
  warrantyInformation: string;
  sku: string;
  tags: string[];
  thumbnail: string;
  images: string[];
  reviews: Review[];
  meta: Meta;
};

function classNames(...classes:any) {
  return classes.filter(Boolean).join(' ')
}

const ProductDetails = () => {
  const { products } = useParams();

  const [productData, setProductData] = useState<Product>();
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState();

  const fetchProducts = async (products: string) => {
    try {
      const response = await fetch(
        `https://dummyjson.com/products/${products}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProductData(data);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (products) {
      const categoryString = Array.isArray(products) ? products[0] : products;
      fetchProducts(categoryString);
    }
  }, [products]);

  return (
    <div>
      <main className="mx-auto max-w-7xl sm:px-6 sm:pt-16 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          {/* Product */}
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            {/* Image gallery */}
            <TabGroup className="flex flex-col-reverse">
              {/* Image selector */}
              <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                <TabList className="grid grid-cols-4 gap-6">
                  {productData?.images.map((image, i) => (
                    <Tab
                      key={i}
                      className="group relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                    >
                      <span className="sr-only">{image}</span>
                      <span className="absolute inset-0 overflow-hidden rounded-md bg-gray-100">
                      <Image
                        alt="image"
                        src={image}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      </span>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-[selected]:ring-indigo-500"
                      />
                    </Tab>
                  ))}
                </TabList>
              </div>

              <TabPanels className="aspect-h-1 aspect-w-1 w-full">
                {productData?.images.map((image, i) => (
                  <TabPanel key={i}>
                    <div className="relative w-full h-0 pb-[100%] sm:rounded-lg bg-gray-100">
                      <Image
                        alt="image"
                        src={image}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>

            {/* Product info */}
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {productData?.title}
              </h1>

              <div className="mt-3">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl tracking-tight text-gray-900">
                  ${productData?.price}
                </p>
              </div>

              {/* Reviews */}
              <div className="mt-3">
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        aria-hidden="true"
                        className={classNames(
                          (productData?.rating||0) > rating ? 'text-indigo-500' : 'text-gray-300',
                          'h-5 w-5 flex-shrink-0',
                          'fill-current'
                        )}
                      />
                    ))}
                  </div>
                  <p className="sr-only">
                    {productData?.rating} out of 5 stars
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="sr-only">Description</h3>

                <div
                  className="space-y-6 text-base text-gray-700"
                >
                  {productData?.description}
                </div>
                
              </div>

              <form className="mt-6">

                <div className="mt-10 flex">
                  <button
                    type="submit"
                    className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                  >
                    Add to bag
                  </button>

                  <button
                    type="button"
                    className="ml-4 border-[2px] border-indigo-400 flex items-center justify-center rounded-md px-3 py-3 text-indigo-400 hover:bg-gray-100 hover:text-gray-500"
                  >
                    <HeartIcon aria-hidden="true" className="h-6 w-6 flex-shrink-0" />
                    <span className="sr-only">Add to favorites</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
