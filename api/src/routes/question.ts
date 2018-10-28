import Router from 'koa-router';
import { Collection } from 'mongodb';
import uuidv4 from 'uuid';
import { get } from 'lodash';
import { db } from '../db';
import s3 from '../s3';

const router = new Router({ prefix: '/question' });

router.post('/', async (ctx: any) => {
  const files = get(ctx.request, 'files');

  console.log(files);

  const images: any[] = files.map(file => file.image);

  const text = get(ctx.request, 'body.text');
  const answersString = get(ctx.request, 'body.answers');
  const correctAnswersIndexesString = get(
    ctx.request,
    'body.correctAnswersIndexes'
  );

  if (
    !images.length ||
    !text ||
    !answersString ||
    !correctAnswersIndexesString
  ) {
    return ctx.throw(400);
  }

  // TODO: in answersString some chars can be escaped, i.e. \' instead of '
  const answers = answersString.split(',');
  const correctAnswersIndexes: number[] = correctAnswersIndexesString
    .split(',')
    .map(parseInt);

  const questions: Collection = db.collection('questions');
  const id = uuidv4();

  await questions.insertOne({
    _id: id,
    text,
    answers,
    correctAnswersIndexes
  });

  // TODO: store the image file

  // TODO: pipe straight to S3

  try {
    await Promise.all(
      images.map(async image => {
        console.log(`image: ${image}`);

        // TODO: get from image
        const fileName = '';
        const fileExtension = '';
        const data = '';

        const params = {
          Bucket: 'arch-quiz-images',
          Key: `${fileName}.${fileExtension}`,
          Body: new Buffer(data, 'base64'),
          ContentEncoding: 'base64',
          ContentType: getContentType(image)
        };
        const uploadOutput = await s3.createMultipartUpload(params);

        console.log(`uploadOutput: ${uploadOutput}`);

        if (typeof uploadOutput.UploadId !== 'string') {
          throw new Error(`S3 file upload failed. Output: ${uploadOutput}`);
        }
      })
    );

    ctx.status = 201;
    ctx.response.body = {
      id,
      text,
      answers,
      correctAnswersIndexes
    };
  } catch (error) {
    await questions.deleteOne({ _id: id });
    console.error(error);
  }
});

function getContentType(image) {
  image;
  // TODO
  return 'image/png';
}

export default router;
