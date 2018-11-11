import { Collection } from 'mongodb';
import { db } from '../../db';
import { Question } from '../../entities/question';
import { InsertFailedError } from '../../helpers/errors';

export async function createQuestionRecord(question: Question): Promise<void> {
  try {
    const questions: Collection = db.collection('questions');

    await questions.insertOne(question);
  } catch (error) {
    throw new InsertFailedError(error.message);
  }
}
