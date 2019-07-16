// Manages image uploads to routes

import cloudinary from 'cloudinary';
import multer from 'multer';
import cloudinaryStorage from 'multer-storage-cloudinary';


/**
 * Handles generating unique file names for uploaded images
 * @param {*} request
 * @param {*} file
 * @param {*} clbk
 */
const fileName = (request, file, clbk) => {
  const { userId } = request.userData;
  const splittedName = file.originalname.split('.');
  const originalName = splittedName.slice(0, splittedName.length - 1).join('.');
  clbk(undefined, `agent${userId}-${new Date().getTime()}-${originalName
    .replace(' ', '-')}`);
};

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Configure cloudinary storage
const storage = cloudinaryStorage({
  cloudinary,
  folder: 'propertypro-lite',
  allowedFormats: ['jpg', 'png', 'jpeg'],
  filename: fileName,
});

// Initialize multer object
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5mb
  },
});

// Export multer object
export default upload.single('image_url');
