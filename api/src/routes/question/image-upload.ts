import s3 from '../../s3';
import config from '../../config';
import { FileStreamWrapper } from '../../helpers/form-data-parser';
import { FormDataInvalidFileError } from '../../helpers/errors';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { last } from 'lodash';

export function deleteQuestionImageFromS3(
  processingResult: ManagedUpload.SendData
): Promise<any> {
  return s3.deleteObject({
    Bucket: config.imageBucketName,
    Key: processingResult.Key
  });
}

export async function uploadQuestionImageToS3(
  file: FileStreamWrapper,
  prefix: string
): Promise<any> {
  if (!['image/png', 'image/jpeg'].includes(file.contentType)) {
    throw new FormDataInvalidFileError(
      'Uploaded file is not valid. Allowed file formats: png, jpeg.'
    );
  }

  const fileExtension = last(file.fileName.split('.'));

  console.log(`uploading file ${prefix}-${file.index}.${fileExtension} to s3`);

  const uploadResult = await s3.upload({
    Bucket: config.imageBucketName,
    Key: `${prefix}-${file.index}.${fileExtension}`,
    Body: file.stream
  });

  console.log(uploadResult);

  return uploadResult;
}
