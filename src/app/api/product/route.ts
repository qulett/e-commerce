import { NextResponse } from 'next/server';
import getLogger from '~/core/logger';

import {
  throwBadRequestException,
  throwInternalServerErrorException,
} from '~/core/http-exceptions';
import { client } from '../supabaseClient';
// create an normal client to write to the subscriptions table

const logger = getLogger();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, photo_url, display_name, price, qty, description } = body;

    // Validate input
    if (!id || !photo_url || !display_name || price == null || qty == null) {
      return throwInternalServerErrorException(`Missing required fields`);
    }

    // Insert data into the products table
    const { data, error } = await client
      .from('products')
      .insert([{ id, photo_url, display_name, price, qty, description }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data }, { status: 201 });
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

    const { data, error } = await client.from('products').select('*');
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
