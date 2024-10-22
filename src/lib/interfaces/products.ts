export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Meta {
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
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
}

export interface CategoryProps{
    name:string;
    slug:string;
}
