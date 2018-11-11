import { split, pipe, map } from 'lodash/fp';
import { CustomFormatRules } from '../../../helpers/format-form-data-fields';
import { QuestionCreateData } from '../../../entities/question';

export function getQuestionCreateRules(): CustomFormatRules<
  QuestionCreateData
> {
  return {
    answers: split(','),
    correctAnswersIndexes: pipe(
      split(','),
      map(parseInt)
    )
  };
}
