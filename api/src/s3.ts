import { promisify } from 'util';
import S3, { CreateMultipartUploadOutput } from 'aws-sdk/clients/s3';

interface PromisifiedS3 {
  createMultipartUpload: (
    CreateMultipartUploadRequest
  ) => Promise<CreateMultipartUploadOutput>;
}

const s3 = new S3();
const createMultipartUpload = promisify(s3.createMultipartUpload);
const promisifiedS3: PromisifiedS3 = {
  createMultipartUpload
};

export default promisifiedS3;
