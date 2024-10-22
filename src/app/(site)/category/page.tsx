'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Container from '~/core/ui/Container';
import { CategoryProps } from '~/lib/interfaces/products';


const Categories = () => {

    const [categories,setCategories]=useState<CategoryProps[]>([])

    const fetchProducts = async () => {
        try {
          const response = await fetch(`https://dummyjson.com/products/categories`); 
          if (!response.ok) {
            throw new Error('Failed to fetch products');
          }
          const data = await response.json();
          setCategories(data);
        } catch (error: any) {
          console.log(error)
        }
      };
    
      useEffect(()=>{
          fetchProducts();
      },[])
    

  return (
    <Container>
      <div className='flex mx-auto p-8 gap-10 flex-wrap  items-center text-blue-600'>
        {
            categories && categories.map((item,i)=>
               <div key={i}>
                 <Link href={`/category/${item.slug}`} >{item.name}</Link>
               </div>
            )
        }
    </div>
    </Container>
  )
}

export default Categories
