'use client'
import React, { useEffect, useState } from 'react'
import Container from '~/core/ui/Container';
import ProductCard from '../components/ProductCard';


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

const Products = () => {

    const [products, setProducts] = useState<Product[]>([]);


  const fetchProducts = async () => {
    try {
      const response = await fetch(`https://dummyjson.com/products`); 
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      console.log(response)
      const data = await response.json();
      setProducts(data.products);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(()=>{
    fetchProducts()
  },[])


  return (
    <Container>
    <div className='mx-auto'>
    <div className='py-5 text-2xl font-semibold'>
    <h1>All Products</h1>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4  gap-4 justify-center">
      {
       products && products.map((item,i)=>(
          <ProductCard
          key={i}
          id={item.id}
          ratings={item.rating}
          imageUrl={item.images[0]}
          productName={item.title}
          discount={item.discountPercentage}
          price={item.price}
          />
        ))
      }
    </div>
  </div>
    </Container>
  )
}

export default Products
