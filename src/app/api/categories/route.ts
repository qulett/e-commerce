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
    const { category_name,description } = await request.json();

    // Basic validation
    if (!category_name || !description) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 },
      );
    }
    const { data, error } = await client.from('product_category').insert([
      {
        category_name,
        description
      },
    ]);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { data: 'categories added successfully' },
      { status: 201 },
    );
  } catch (error: any) {
    return throwInternalServerErrorException(error.message);
  }
}

export async function GET(request: Request) {
  try {
    const { data, error } = await client.from('product_category').select('*');
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
    const {searchParams} = new URL(request.url)
    const body = await request.json();
    const id =searchParams.get('id')


    // Validate input
    if (!id) {
      return NextResponse.json({ error: 'Missing required field: id' }, { status: 400 });
    }

    // Delete data from the products table
    const { data, error } = await client
      .from('product_category')
      .update(body)
      .eq('category_id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data:"Category updated successfully!" }, { status: 200 });
  } catch (error: any) {
    return throwInternalServerErrorException(error.message);
  }
}
export async function DELETE(request: Request) {
  try {
    const {searchParams} = new URL(request.url)
    const id =searchParams.get('id')


    // Validate input
    if (!id) {
      return NextResponse.json({ error: 'Missing required field: id' }, { status: 400 });
    }

    // Delete data from the products table
    const { data, error } = await client
      .from('product_category')
      .delete()
      .eq('category_id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: 'Category deleted successfully!' }, { status: 200 });
  } catch (error: any) {
    return throwInternalServerErrorException(error.message);
  }
}
