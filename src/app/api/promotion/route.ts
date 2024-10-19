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
    const { photo_url, expired_at } = body;
    let fileName = new Date().toISOString();

    // Validate input
    if (!photo_url || !expired_at) {
      return throwInternalServerErrorException(`Missing required fields`);
    }
    let urlData = await uploadBase64Image(
      photo_url,
      'avatars/promotions',
      fileName,
    );
    // Insert data into the products table
    const { data, error } = await client
      .from('promotion')
      .insert([{ photo_url: urlData, active: true, expired_at }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { data: 'promotion added successfully' },
      { status: 201 },
    );
  } catch (error: any) {
    return throwInternalServerErrorException(error.message);
  }
}

export async function GET(request: Request) {
  try {
    let query = client.from('promotion').select('*');
    const { data, error } = await query;
    if (error) {
      throw error;
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return throwInternalServerErrorException(error.message);
  }
}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}
