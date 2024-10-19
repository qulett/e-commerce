import { NextResponse } from 'next/server';
import getLogger from '~/core/logger';

import {
  throwBadRequestException,
  throwInternalServerErrorException,
} from '~/core/http-exceptions';
import { client } from '../supabaseClient';
import { uploadBase64Image } from '../utils/fileUpload';

const logger = getLogger();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { photo_url, display_name, price, qty, description } = body;
    let fileName = new Date().toISOString();

    // Validate input
    if (!photo_url || !display_name || price == null || qty == null) {
      return throwInternalServerErrorException(`Missing required fields`);
    }
    let urlData = await uploadBase64Image(
      photo_url,
      'avatars/products',
      fileName,
    );
    // Insert data into the products table
    const { data, error } = await client
      .from('products')
      .insert([{ photo_url: urlData, display_name, price, qty, description }]);

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
    const category = queryParams.get('category');
    const bestseller = queryParams.get('bestseller');
    const rating = queryParams.get('rating');
    const brand = queryParams.get('brand');
    const name = queryParams.get('name');
    const priceFilter = queryParams.get('priceFilter');
    const minPriceRange = queryParams.get('minPriceRange');
    const maxPriceRange = queryParams.get('maxPriceRange');

    // Build query based on provided filters
    let query = client.from('products').select('*');

    if (category) query = query.eq('category', category);
    if (bestseller) query = query.eq('best_seller', bestseller === 'true');
    if (rating) query = query.gte('rating', parseFloat(rating));
    if (brand) query = query.ilike('brand', `%${brand}%`);
    if (name) query = query.ilike('display_name', `%${name}%`);
    if (priceFilter) query = query.order('price', { ascending: true });

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

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return throwInternalServerErrorException(error.message);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, photo_url, display_name, price, qty, description } = body;

    // Validate input
    if (!id) {
      return throwInternalServerErrorException('Missing required field: id');
    }

    // Update data in the products table
    const { data, error } = await client
      .from('products')
      .update({ photo_url, display_name, price, qty, description })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return throwInternalServerErrorException(error.message);
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    // Validate input
    if (!id) {
      return throwInternalServerErrorException('Missing required field: id');
    }

    // Delete data from the products table
    const { data, error } = await client.from('products').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return throwInternalServerErrorException(error.message);
  }
}
