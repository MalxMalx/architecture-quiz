import uuidv4 from 'uuid';

export interface QuestionCreateData {
  text: string;
  answers: string[];
  correctAnswersIndexes: number[];
}

export interface Question {
  _id: string;
  text: string;
  answers: string[];
  correctAnswersIndexes: number[];
}

export interface QuestionResponse {
  id: string;
  text: string;
  answers: string[];
  correctAnswersIndexes: number[];
}

export function createQuestion(data: QuestionCreateData): Question {
  const id = uuidv4();
  const { text, answers, correctAnswersIndexes } = data;

  return {
    _id: id,
    text,
    answers,
    correctAnswersIndexes
  };
}

export function createQuestionResponse(question: Question): QuestionResponse {
  const { text, answers, correctAnswersIndexes, _id } = question;

  return {
    id: _id,
    text,
    answers,
    correctAnswersIndexes
  };
}
