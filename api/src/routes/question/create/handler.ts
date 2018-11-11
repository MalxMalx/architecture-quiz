import { IRouterContext } from 'koa-router';
import { validateFormDataFields } from './validation';
import {
  QuestionCreateData,
  createQuestion,
  Question,
  createQuestionResponse
} from '../../../entities/question';
import { FormDataFields } from '../../../entities/form-data';
import { requestFieldsSchema } from './schemas';
import { FormDataParser } from '../../../helpers/form-data-parser';
import {
  FormDataNoFilesError,
  FormDataNoFieldsError,
  FormDataInvalidFormError,
  FormDataInvalidFileError
} from '../../../helpers/errors';
import { formatFields } from '../../../helpers/format-form-data-fields';
import { getQuestionCreateRules } from './format';
import {
  deleteQuestionImageFromS3,
  uploadQuestionImageToS3
} from '../image-upload';
import { createQuestionRecord } from '../create-question-record';

export default async function handleCreate(ctx: IRouterContext) {
  const { req } = ctx.request;

  const formDataParser = new FormDataParser(req);

  const deleteUploadedFiles = () =>
    Promise.all(
      formDataParser.getProcessingResults().map(deleteQuestionImageFromS3)
    );
  const handleInternalServerError = async (
    error,
    message = 'Internal Server Error'
  ): Promise<void> => {
    console.error(error);
    await deleteUploadedFiles();
    ctx.throw(500, message);
  };

  req.on('error', error =>
    handleInternalServerError(error, 'Request stream error')
  );

  try {
    const unformattedFields: FormDataFields = await formDataParser.getFields();

    console.log(
      `unformattedFields: ${JSON.stringify(unformattedFields, null, 2)}`
    );

    const validationErrors = validateFormDataFields(
      requestFieldsSchema,
      unformattedFields
    );

    if (validationErrors) {
      return ctx.throw(400, validationErrors);
    }

    const questionData: QuestionCreateData = formatFields(
      unformattedFields,
      getQuestionCreateRules()
    );

    console.log(
      `formatted question data: ${JSON.stringify(questionData, null, 2)}`
    );

    const question: Question = createQuestion(questionData);

    console.log(`question object: ${JSON.stringify(question, null, 2)}`);

    await formDataParser.processFiles(file =>
      uploadQuestionImageToS3(file, question._id)
    );

    console.log('Successfully uploaded all files to S3');
    console.log(JSON.stringify(formDataParser.getProcessingResults(), null, 2));

    await createQuestionRecord(question);

    console.log('Successfully created a new question');

    ctx.status = 201;
    ctx.response.body = createQuestionResponse(question);
  } catch (error) {
    if (
      error instanceof FormDataNoFilesError ||
      error instanceof FormDataNoFieldsError ||
      error instanceof FormDataInvalidFormError
    ) {
      return ctx.throw(400, error.message);
    }

    if (error instanceof FormDataInvalidFileError) {
      await deleteUploadedFiles();
      return ctx.throw(400, error.message);
    }

    return handleInternalServerError(error, error.message);
  }
}
