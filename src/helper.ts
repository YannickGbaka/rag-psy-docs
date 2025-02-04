import multer from 'multer';

// Configure multer for file uploads
const uploadFile = multer({
    storage: multer.diskStorage({
      // Set the destination folder where uploaded files will be stored
      destination: (req, file, cb) => cb(null, "data"),
      // Configure how uploaded files will be renamed
      filename: (req, file, cb) => {
        const fileExtension = file.originalname.split('.').pop() || '';
        cb(null, `sample.${fileExtension}`);
      },
    }),
  });

export {uploadFile};