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
    const { title, image_url, start_date, end_date, category_id, product_id } =
      body;
    let fileName = new Date().toISOString();

    // Validate input
    if (!image_url || !start_date || !end_date) {
      return throwInternalServerErrorException(`Missing required fields`);
    }

    let urlData = await uploadBase64Image(
      image_url,
      'store',
      'banner',
      fileName,
    );

    let payload: Banner = {
      title,
      image_url: urlData,
      start_date,
      end_date,
    };
    if (category_id) {
      payload['category_id'] = category_id;
    }
    if (product_id) {
      payload['product_id'] = product_id;
    }

    // Insert data into the products table
    const { data, error } = await client.from('banners').insert([payload]);

    if (error) {
      return throwInternalServerErrorException(error.message);
    }

    return NextResponse.json(
      { data: 'banner added successfully' },
      { status: 201 },
    );
  } catch (error: any) {
    return throwInternalServerErrorException(error.message);
  }
}

export async function GET(request: Request) {
  try {
    const currentDate = new Date().toISOString(); // Get the current date in ISO format

    // Fetch promotions that haven't expired yet
    let query = client
      .from('promotion')
      .select('*')
      .gt('expired_at', currentDate); // Only select promotions where expired_at is greater than the current date

    const { data, error } = await query;
    if (error) {
      throw error;
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return throwInternalServerErrorException(error.message);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, photo_url, expired_at } = body;

    // Validate `id` first
    if (!id) {
      return throwInternalServerErrorException('Missing required field: id');
    }
    if (photo_url) {
      let fileName = new Date().toISOString();
      let urlData = await uploadBase64Image(
        photo_url,
        'store',
        'banner',
        fileName,
      );
      const { data, error } = await client
        .from('promotion')
        .update([{ photo_url: urlData }])
        .eq('id', id);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
    if (expired_at) {
      // Insert data into the products table
      const { data, error } = await client
        .from('promotion')
        .update([{}])
        .eq('id', id);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
    return NextResponse.json(
      { data: 'promotion update successfully' },
      { status: 201 },
    );
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
    const { data, error } = await client
      .from('promotion')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: 'deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return throwInternalServerErrorException(error.message);
  }
}

export type Banner = {
  title: string; // VARCHAR(255)
  image_url: string | NextResponse<{}>; // TEXT
  start_date: Date; // DATE
  end_date: Date; // DATE
  is_active?: boolean; // BOOLEAN
  category_id?: string | null; // UUID (optional, can be null)
  product_id?: string | null; // UUID (optional, can be null)
};
