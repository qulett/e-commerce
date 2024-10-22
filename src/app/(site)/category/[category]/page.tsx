'use client'
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Container from '~/core/ui/Container';
import ProductCard from '../../components/ProductCard';
import { Product } from '~/lib/interfaces/products';




const CategoryPage = () => {

  const { category } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState(null)


  const fetchProducts = async (category: string) => {
    try {
      const response = await fetch(`https://dummyjson.com/products/category/${category}`); 
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      console.log(response)
      const data = await response.json();
      setProducts(data.products);
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(()=>{
    if (category) {
      const categoryString = Array.isArray(category)?category[0] :category;
      fetchProducts(categoryString);
    }
  },[category])

    
  return (
    <Container>
    <div className='mx-auto'>
    <div className='py-5 text-2xl font-semibold'>
    <h1>{typeof category === 'string' ? category.charAt(0).toUpperCase() + category.slice(1) : ''}</h1>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4 justify-center">
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

export default CategoryPage
