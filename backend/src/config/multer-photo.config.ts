import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';

export const multerPhotosConfig = {
  dest: `./public/${process.env.PHOTO_UPLOAD_LOCATION || 'photos'}`,
  fileSize: +process.env.PHOTO_MAX_SIZE || 2000000, // 2MB
};

const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

export const multerPhotosOptions = {
  limits: {
    fileSize: multerPhotosConfig.fileSize,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      cb(null, true);
    } else {
      cb(
        new BadRequestException(
          `Unsupported file type ${extname(file.originalname)}`,
        ),
        false,
      );
    }
  },
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = multerPhotosConfig.dest;

      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  }),
};
