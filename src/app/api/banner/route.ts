import { NextResponse } from 'next/server';
import getLogger from '~/core/logger';
import {
  throwBadRequestException,
  throwInternalServerErrorException,
} from '~/core/http-exceptions';
import { client } from '../supabaseClient';

const logger = getLogger();

const validateRequestBody = (body: any, requiredFields: string[]) => {
  for (const field of requiredFields) {
    if (!body[field]) return false;
  }
  return true;
};

// Helper function to upload an image to Supabase bucket
async function uploadImageToSupabase(base64String: string, imageName: string) {
  const imageBuffer = Buffer.from(base64String, 'base64');
  const { data, error } = await client.storage
    .from('banners') // replace with your bucket name
    .upload(`banners/${imageName}`, imageBuffer, {
      contentType: 'image/jpeg', // Adjust if necessary
      upsert: true,
    });

  if (error) throw new Error(`Failed to upload image: ${error.message}`);

  // Generate a public URL for the uploaded image
  const { data: publicUrlData } = client.storage
    .from('banners')
    .getPublicUrl(`banners/${imageName}`);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    throw new Error('Unable to retrieve the public URL of the uploaded image');
  }

  return { publicUrl: publicUrlData.publicUrl, path: `banners/${imageName}` };
}

// Helper function to delete image from Supabase bucket
async function deleteImageFromSupabase(imagePath: string) {
  const { error } = await client.storage.from('banners').remove([imagePath]);
  if (error) throw new Error(`Failed to delete image: ${error.message}`);
}

export async function GET() {
  try {
    const { data, error } = await client.from('banners').select('*');
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return throwInternalServerErrorException(error.message);
  }
}

// POST - Create a new banner
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const requiredFields = [
      'title',
      'image_base64',
      'category_id',
      'start_date',
      'end_date',
      'is_active',
    ];

    if (!validateRequestBody(body, requiredFields)) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Upload the image to Supabase
    const { publicUrl, path } = await uploadImageToSupabase(
      body.image_base64,
      `banner_${Date.now()}.jpg`,
    );

    // Insert the banner data into the database
    const bannerData = {
      title: body.title,
      image_url: publicUrl,
      category_id: body.category_id,
      start_date: body.start_date,
      end_date: body.end_date,
      is_active: body.is_active,
    };
    const { data, error } = await client.from('banners').insert([bannerData]);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(
      { message: 'Banner added successfully', data },
      { status: 201 },
    );
  } catch (error: any) {
    logger.error('Error adding banner:', error);
    return throwInternalServerErrorException(error.message);
  }
}

// PUT - Update an existing banner
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const requiredFields = [
      'id',
      'title',
      'category_id',
      'start_date',
      'end_date',
      'is_active',
    ];

    if (!validateRequestBody(body, requiredFields)) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 },
      );
    }

    const { id, image_base64, ...updateFields } = body;

    // Check if a new image was provided
    if (image_base64) {
      // Get the current banner details to retrieve the old image URL
      const { data: currentBannerData, error: fetchError } = await client
        .from('banners')
        .select('image_url') // Retrieve path instead of full URL
        .eq('id', id)
        .single();

      if (fetchError)
        return NextResponse.json(
          { error: fetchError.message },
          { status: 500 },
        );

      // Delete the old image if it exists
      if (currentBannerData?.image_url) {
        await deleteImageFromSupabase(currentBannerData.image_url);
      }

      // Upload the new image
      const { publicUrl: newImageUrl, path: newImagePath } =
        await uploadImageToSupabase(image_base64, `banner_${Date.now()}.jpg`);
      updateFields.image_url = newImageUrl;
      updateFields.image_url = newImagePath; // Update the path as well
    }

    // Update the banner data in the database
    const { data, error } = await client
      .from('banners')
      .update(updateFields)
      .eq('id', id);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(
      { message: 'Banner updated successfully', data },
      { status: 200 },
    );
  } catch (error: any) {
    logger.error('Error updating banner:', error);
    return throwInternalServerErrorException(error.message);
  }
}

// DELETE - Remove an existing banner
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id)
      return NextResponse.json(
        { message: 'Banner ID is required' },
        { status: 400 },
      );

    // Get the banner details to retrieve the image URL
    const { data: currentBannerData, error: fetchError } = await client
      .from('banners')
      .select('image_url') // Retrieve image_url instead of full URL
      .eq('banner_id', id)
      .single();

    if (fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 });

    // Delete the image from Supabase if it exists
    if (currentBannerData?.image_url) {
      await deleteImageFromSupabase(currentBannerData.image_url);
    }

    // Delete the banner data from the database
    const { data, error } = await client
      .from('banners')
      .delete()
      .eq('banner_id', id);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(
      { message: 'Banner deleted successfully', data },
      { status: 200 },
    );
  } catch (error: any) {
    logger.error('Error deleting banner:', error);
    return throwInternalServerErrorException(error.message);
  }
}
