import { Collection } from 'mongodb';
import { GetAllFailedError } from '../../helpers/errors';
import { db } from '../../db';
import { Question } from '../../entities/question';

export async function getAllQuestionRecords(): Promise<Question[]> {
  try {
    const questions: Collection = db.collection('questions');
    const cursor = await questions.find();
    const allQuestionRecords = await cursor.toArray();

    return allQuestionRecords;
  } catch (error) {
    throw new GetAllFailedError(error.message);
  }
}
