import { Answer } from './answer.model';
import { APIResponseQuestionModel } from './api.model';

export interface QuestionModel
  extends Omit<
    APIResponseQuestionModel,
    'correct_answer' | 'incorrect_answers'
  > {
  id: string;
  answers: Answer[] | null;
}
