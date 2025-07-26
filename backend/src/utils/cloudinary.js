import cloudinary from 'cloudinary';
import { ApiError } from './api-error.js';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const uploadImageToCloudinary = async (fileBuffer) => {
  try {
    return await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'chat-app',
          use_filename: false,
          unique_filename: true,
          overwrite: false,
        },
        (error, result) => {
          if (error) {
            console.log('Cloudinary upload error:', error);
            return reject(new ApiError('Cloudinary upload failed'));
          } else {
            console.log('Cloudinary upload result:', result);
            return resolve(result);
          }
        }
      );

      stream.end(fileBuffer);
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};
