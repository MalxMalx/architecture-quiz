import S3, {
  PutObjectRequest,
  DeleteObjectRequest,
  DeleteObjectOutput,
  ManagedUpload
} from 'aws-sdk/clients/s3';

// TODO: WOW THIS WHOLE THING JUST SUCKS

interface PromisifiedS3 {
  upload: (reqParams: PutObjectRequest) => Promise<ManagedUpload.SendData>;
  deleteObject: (reqParams: DeleteObjectRequest) => Promise<DeleteObjectOutput>;
}

const s3 = new S3();

const upload: PromisifiedS3['upload'] = reqParams =>
  new Promise((resolve, reject) =>
    s3.upload(reqParams, undefined, (err, data) =>
      err ? reject(err) : resolve(data)
    )
  );

const deleteObject: PromisifiedS3['deleteObject'] = reqParams =>
  new Promise((resolve, reject) =>
    s3.deleteObject(reqParams, (err, data) =>
      err ? reject(err) : resolve(data)
    )
  );

const promisifiedS3: PromisifiedS3 = {
  upload,
  deleteObject
};

export default promisifiedS3;
