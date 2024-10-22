import { StarIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Button from '~/core/ui/Button';

interface ProductCardProps {
  id: number;
  imageUrl: string; // URL of the product image
  productName: string; // Name of the product
  price: number; // Price of the product (string format to handle currency)
  discount?: number;
  ratings?: number;
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  imageUrl,
  productName,
  price,
  discount,
  ratings,
}) => {
  return (
    <Link href={`/products/${id}`} className="flex flex-col bg-white rounded-xl">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden lg:aspect-none group-hover:opacity-75 lg:h-80">
        <div className="relative w-full h-0 pb-[100%] sm:rounded-lg">
          <Image
            alt="image"
            src={imageUrl}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
      </div>
      <div className="p-4">
        <div className="text-sm md:text-base flex justify-between ">
          <span>
            {productName.length > 25
              ? productName.slice(0, 25) + '...'
              : productName}
          </span>
          <span className="flex items-center">
            {[0, 1, 2, 3, 4].map((rating) => (
              <StarIcon
                key={rating}
                aria-hidden="true"
                className={classNames(
                  (ratings || 0) > rating ? 'text-indigo-500' : 'text-gray-300',
                  'h-3 w-3 flex-shrink-0',
                  'fill-current',
                )}
              />
            ))}
          </span>
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col">
            <div className="text-sm md:text-base font-bold">Rs. {price}</div>
            {discount && (
              <div className="text-sm text-green-600 font-semibold">
                {Math.round(discount)}% off
              </div>
            )}
          </div>
          <Button size={'sm'} className="h-8 bg-indigo-500">
            Buy Now
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
