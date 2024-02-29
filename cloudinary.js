const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({ 
    cloud_name: 'htqoudlxz', 
    api_key: '916439993188377', 
    api_secret: 'xFJiNTT5JjB8B7MWT_z3qLbmbNg' 
  });

const uploadImage = async (imageBuffer) => {
  try {
    const result = await cloudinary.uploader.upload(imageBuffer, {
      folder: 'user_images' // Cloudinary에 이미지를 업로드할 폴더를 지정합니다.
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};


module.exports = {
  uploadImage : uploadImage
};