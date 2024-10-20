import Link from 'next/link';
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon';

import NavigationMenuItem from '~/core/ui/Navigation/NavigationItem';
import NavigationMenu from '~/core/ui/Navigation/NavigationMenu';

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuTrigger,
} from '~/core/ui/Dropdown';
import { useEffect, useState } from 'react';
import CategoryPopup from './CategoryPopup';

const links = {
  SignIn: {
    label: 'Sign In',
    path: '/auth/sign-in',
  },
  Blog: {
    label: 'Blog',
    path: '/blog',
  },
  Docs: {
    label: 'Documentation',
    path: '/docs',
  },
  Pricing: {
    label: 'Pricing',
    path: '/pricing',
  },
  FAQ: {
    label: 'FAQ',
    path: '/faq',
  },
  Products: {
    label: 'Products',
    path: '/products',
  },
  Categories: {
    label: 'Categories',
    path: '',
  },
};
interface CategoryProps{
  name:string;
  slug:string;
}

const SiteNavigation = () => {
  const className = 'font-semibold';

    const [categories,setCategories]=useState<CategoryProps[]>([])
    const [isPopupOpen, setPopupOpen] = useState(false);

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
    
  const togglePopup = () => {
    setPopupOpen(!isPopupOpen);
  };

  return (
    <>
      <div className={'hidden items-center space-x-0.5 lg:flex'}>
        <NavigationMenu>
          <NavigationMenuItem
            className={'flex lg:hidden'}
            link={links.SignIn}
          />

          <NavigationMenuItem className={className} link={links.Blog} />
          <NavigationMenuItem className={className} link={links.Docs} />
          <NavigationMenuItem className={className} link={links.Pricing} />
          <NavigationMenuItem className={className} link={links.Products} />
           {/* Categories dropdown */}
           <DropdownMenu>
            <DropdownMenuTrigger className={className} onClick={togglePopup}>
            <NavigationMenuItem className={className} link={links.Categories} />
            </DropdownMenuTrigger>
          </DropdownMenu>

          <NavigationMenuItem className={className} link={links.FAQ} />
        </NavigationMenu>
      </div>

{/* Category popup */}
      {isPopupOpen && (
        <CategoryPopup 
          categories={categories} 
          onClose={togglePopup} 
        />
      )}

      <div className={'flex items-center lg:hidden'}>
        <MobileDropdown />
      </div>
    </>
  );
};

function MobileDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={'Menu'}>
        <Bars3Icon className={'h-9'} />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {Object.values(links).map((item) => {
          const className = 'flex w-full h-full items-center';

          return (
            <DropdownMenuItem key={item.path}>
              <Link className={className} href={item.path}>
                {item.label}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default SiteNavigation;
