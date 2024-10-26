import { NextResponse } from 'next/server';

import { client } from '../supabaseClient';
import { throwInternalServerErrorException } from '~/core/http-exceptions';
import { uploadBase64Image } from '../utils/fileUpload';

export async function POST(request: Request) {
  try {
    const { product_id, image_url, is_primary } = await request.json();
    let fileName = new Date().toISOString();

    // Basic validation
    if (!product_id || !image_url) {
      return throwInternalServerErrorException(`Missing required fields`);
    }

    let urlData = await uploadBase64Image(
      image_url,
      'store',
      'product_images',
      fileName,
    );

    const payload = {
      product_id,
      image_url: urlData,
    };

    const { data, error } = await client
      .from('product_images')
      .insert([payload]);

    if (error) {
      return throwInternalServerErrorException(error.message);
    }

    return NextResponse.json(
      { data: 'product image added successfully!' },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return throwInternalServerErrorException('Missing required field: id');
    }

    const { data: imageData, error: fetchError } = await client
      .from('product_images')
      .select('image_url')
      .eq('image_id', id)
      .single();

    if (fetchError || !imageData) {
      return throwInternalServerErrorException('Image not found!');
    }

    const imageUrl: string = imageData.image_url;
    const fileName = imageUrl.split('/').pop();

    if (!fileName) {
      return throwInternalServerErrorException('Invalid image URL');
    }

    const { error: deleteError } = await client.storage
      .from('store')
      .remove([`product_images/${fileName}`]);

    if (deleteError) {
      return throwInternalServerErrorException(
        'Failed to delete image from storage',
      );
    }

    const { error:dbError } = await client
      .from('product_images')
      .delete()
      .eq('image_id', id);

    if (dbError) {
      return throwInternalServerErrorException(dbError.message);
    }

    return NextResponse.json(
      { data: 'Image deleted successfully!' },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
