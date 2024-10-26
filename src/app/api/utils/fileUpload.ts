import getLogger from '~/core/logger';
import { client } from '../supabaseClient';
import {
  throwBadRequestException,
  throwInternalServerErrorException,
} from '~/core/http-exceptions';
import fs from 'fs';
import util from 'util';
const logger = getLogger();

// Upload Image Function
export async function uploadBase64Image(
  base64: string,
  bucketName: string,
  folderName: string,
  fileName: string,
) {
  try {
    // Convert base64 to File
    const file = await base64ToFile(base64, fileName);
    // Upload image to Supabase Storage
    const { data: fileData, error } = await client.storage
      .from(bucketName)
      .upload(`${folderName}/${fileName}`, file, {
        cacheControl: '3600',
        upsert: true, // Set to true if you want to overwrite
      });

    if (error) {
      logger.error(error.message);
      throw error;
    }

    // Get public URL for the uploaded file
    const { data } = client.storage
      .from(bucketName)
      .getPublicUrl(`${folderName}/${fileName}`);

    // Return the public URL
    return data.publicUrl;
  } catch (error) {
    logger.error(error);
    // throw new Error('Failed to upload image');
    return throwInternalServerErrorException(`Failed to upload image`);
  }
}

// Function to convert base64 to a File object
async function base64ToFile(base64: string, filename: string) {
  const writeFileAsync = util.promisify(fs.writeFile);
  const readFileAsync = util.promisify(fs.readFile);
  const unlinkAsync = util.promisify(fs.unlink);
  await writeFileAsync('image.png', base64, { encoding: 'base64' });
  const buffer = await readFileAsync('image.png');
  await unlinkAsync('image.png');
  return buffer;
}

export async function deleteUploadedImage(
  bucketName: string,
  folderName: string,
  publicUrl: string,
) {
  const fileName = publicUrl.split(`${bucketName}/`)[1];
  const { data: deleteData, error: deleteError } = await client.storage
    .from(bucketName)
    .remove([`${fileName}`]);

  if (deleteError) {
    return false;
  }
  return true;
}
