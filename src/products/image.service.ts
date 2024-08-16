import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class ImageService {
  private client: S3Client;
  private bucketName = this.configService.get('S3_BUCKET_NAME');
  private s3Region = this.configService.get('S3_REGION');

  constructor(private readonly configService: ConfigService) {
    const accessKeyId = this.configService.get('S3_ACCESS_KEY');
    const secretAccessKey = this.configService.get('S3_SECRET_ACCESS_KEY');

    if (
      !this.s3Region ||
      !accessKeyId ||
      !secretAccessKey ||
      !this.bucketName
    ) {
      throw new Error('S3 Configuration not found on enviroment');
    }

    this.client = new S3Client({
      region: this.s3Region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
      forcePathStyle: true,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    key: string,
  ): Promise<{ url: string }> {
    // get Product, create product Image entity.
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',

        Metadata: {
          originalName: file.originalname,
        },
      });

      await this.client.send(command);

      return await this.getFileUrl(key);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getFileUrl(key: string) {
    return {
      url: `https://${this.bucketName}.s3.${this.s3Region}.amazonaws.com/${key}`,
    };
  }

  async deleteProductImage(key: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.client.send(command);

      return { message: 'File deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
