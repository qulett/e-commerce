import Link from 'next/link';
import React, { useEffect, useRef } from 'react';

interface CategoryProps {
  name: string;
  slug: string;
}

interface Props {
  categories: CategoryProps[];
  onClose: () => void;
}

const CategoryPopup: React.FC<Props> = ({ categories, onClose }) => {
  const popupRef = useRef<HTMLDivElement | null>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    // Attach event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={popupRef}
      className="absolute top-[60px] z-10 mx-auto shadow-lg max-h-64 overflow-y-auto border-[0.5px] border-gray-200 bg-white rounded-md p-4 grid grid-cols-6 gap-8"
    >
      {categories &&
        categories.map((item, i) => (
          <Link key={i} href={`/category/${item.slug}`} className="text-gray-800 hover:text-indigo-500" onClick={()=>onClose()}>
            {item.name}
          </Link>
        ))}
    </div>
  );
};

export default CategoryPopup;
