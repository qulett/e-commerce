import { NextResponse } from 'next/server';
import getLogger from '~/core/logger';

import {
  throwBadRequestException,
  throwInternalServerErrorException,
} from '~/core/http-exceptions';
import { client } from '../supabaseClient';
import { deleteUploadedImage, uploadBase64Image } from '../utils/fileUpload';

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
    let query = client.from('banners').select('*').eq('is_active', true); // Only select promotions where expired_at is greater than the current date

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
    const {
      banner_id,
      title,
      image_url,
      start_date,
      end_date,
      category_id,
      product_id,
    } = body;

    // Validate `id` first
    if (!banner_id) {
      return throwInternalServerErrorException(
        'Missing required field: banner_id',
      );
    }
    let updatePayload: any = {};
    if (image_url) {
      let query = client.from('banners').select('*').eq('banner_id', banner_id);
      const { data: previousData, error: previousDataError } = await query;
      if (previousDataError) {
        return throwInternalServerErrorException(previousDataError.message);
      }

      const checkDeletionStatus = await deleteUploadedImage(
        'store',
        'banner',
        previousData[0].image_url,
      );
      if (!checkDeletionStatus) {
        return throwInternalServerErrorException('deletion of file failed');
      }
      let fileName = new Date().toISOString();
      let urlData = await uploadBase64Image(
        image_url,
        'store',
        'banner',
        fileName,
      );
      updatePayload['image_url'] = urlData;
    }
    if (title) {
      updatePayload['title'] = title;
    }
    if (start_date) {
      updatePayload['start_date'] = start_date;
    }
    if (end_date) {
      updatePayload['end_date'] = end_date;
    }
    if (category_id) {
      updatePayload['category_id'] = category_id;
    }
    if (product_id) {
      updatePayload['product_id'] = product_id;
    }

    const { data: updateData, error: updateError } = await client
      .from('banners')
      .update([updatePayload])
      .eq('banner_id', banner_id);
    if (updateError) {
      return throwInternalServerErrorException(updateError.message);
    }
    return NextResponse.json(
      { message: 'promotion update successfully' },
      { status: 201 },
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

    const { data: previousData, error: previousDataError } = await client
      .from('banners')
      .select('*')
      .eq('banner_id', id);
    if (previousDataError) {
      return throwInternalServerErrorException(previousDataError.message);
    }
    const checkDeletionStatus = await deleteUploadedImage(
      'store',
      'banner',
      previousData[0].image_url,
    );
    if (!checkDeletionStatus) {
      return throwInternalServerErrorException('deletion of file failed');
    }

    // Delete data from the products table
    const { data, error } = await client
      .from('banners')
      .delete()
      .eq('banner_id', id);

    if (error) {
      return throwInternalServerErrorException(error.message);
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
