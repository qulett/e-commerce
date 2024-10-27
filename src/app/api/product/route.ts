import { NextResponse } from 'next/server';
import getLogger from '~/core/logger';

import {
  throwBadRequestException,
  throwInternalServerErrorException,
} from '~/core/http-exceptions';
import { client } from '../supabaseClient';
import { uploadBase64Image } from '../utils/fileHandler';

const logger = getLogger();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, quantity, description, category_id } = body;
    let fileName = new Date().toISOString();

    // Validate input
    if (
      !description ||
      !name ||
      !category_id ||
      price == null ||
      quantity == null
    ) {
      return throwInternalServerErrorException(`Missing required fields`);
    }
    const { data, error } = await client.from('products').insert([
      {
        name,
        price,
        quantity,
        description,
        category_id,
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { data: 'product added successfully' },
      { status: 201 },
    );
  } catch (error: any) {
    return throwInternalServerErrorException(error.message);
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const queryParams = url.searchParams;
    const category_id = queryParams.get('category_id');
    const bestseller = queryParams.get('bestseller');
    const rating = queryParams.get('rating');
    const brand = queryParams.get('brand');
    const name = queryParams.get('name');
    const priceFilter = queryParams.get('priceFilter');
    const minPriceRange = queryParams.get('minPriceRange');
    const maxPriceRange = queryParams.get('maxPriceRange');
    const product_id = queryParams.get('product_id');
    // Build query based on provided filters
    let query = client.from('products').select('*');
    if (category_id) query = query.eq('category_id', category_id);
    if (bestseller) query = query.eq('best_seller', bestseller === 'true');
    if (rating) query = query.gte('rating', parseFloat(rating));
    if (brand) query = query.ilike('brand', `%${brand}%`);
    if (name) query = query.ilike('display_name', `%${name}%`);
    if (priceFilter) query = query.order('price', { ascending: true });
    if (product_id) query = query.eq('product_id', product_id);
    // Handle price filtering
    if (minPriceRange && maxPriceRange) {
      query = query
        .gte('price', parseFloat(minPriceRange))
        .lte('price', parseFloat(maxPriceRange));
    }
    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    for (let i = 0; i < data.length; i++) {
      const { data: productImageData, error: productImageError } = await client
        .from('product_images')
        .select('image_id,image_url')
        .eq('product_id', data[i].product_id);
      data[i]['ImageData'] = await productImageData;
    }
    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return throwInternalServerErrorException(error.message);
  }
}

export async function PUT(request: Request) {
  try {
    // const { id, photo_url, display_name, price, qty, description } = body;

    const { searchParams } = new URL(request.url);
    const body = await request.json();
    const id = searchParams.get('id');

    // Validate input
    if (!id) {
      return throwInternalServerErrorException('Missing required field: id');
    }
    // Update data in the products table
    const { data, error } = await client
      .from('products')
      .update(body)
      .eq('product_id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { data: 'Product update successfully!' },
      { status: 200 },
    );
  } catch (error: any) {
    return throwInternalServerErrorException(error.message);
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate input
    if (!id) {
      return throwInternalServerErrorException('Missing required field: id');
    }

    const { data: images, error: fetchImagesError } = await client
      .from('product_images')
      .select('image_url')
      .eq('product_id', id);

    if (fetchImagesError) {
      return throwInternalServerErrorException(fetchImagesError.message);
    }

    // Step 2: Delete images from Supabase Storage
    const filePaths = images.map((image) => {
      const fileName = image.image_url.split('/').pop();
      return `product_images/${fileName}`;
    });

    const { error: deleteStorageError } = await client.storage
      .from('store')
      .remove(filePaths);

    if (deleteStorageError) {
      return throwInternalServerErrorException(deleteStorageError.message);
    }

    const { error: deleteImagesError } = await client
      .from('product_images')
      .delete()
      .eq('product_id', id);

    if (deleteImagesError) {
      return throwInternalServerErrorException(deleteImagesError.message);
    }

    // Delete data from the products table
    const { data, error } = await client
      .from('products')
      .delete()
      .eq('product_id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { data: 'Product deleted successfully!' },
      { status: 200 },
    );
  } catch (error: any) {
    return throwInternalServerErrorException(error.message);
  }
}
