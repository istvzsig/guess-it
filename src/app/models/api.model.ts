import { QuestionModel } from './question.model';

export interface APIError {
  message: string;
  error_code?: number;
}

export interface APIRequestModel {
  response_code: number;
  results: APIResponseQuestionModel[];
}

export interface APIResponseModel {
  error?: APIError | string;
  data?: QuestionModel | null;
}

export interface APIResponseQuestionModel {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  category: string;
  difficulty: string;
  type: string;
}
