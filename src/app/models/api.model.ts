import { APIResponseQuestionModel, QuestionModel } from './question.model';

export interface APIRequestModel {
  response_code: number;
  results: APIResponseQuestionModel[];
}

export interface APIError {
  message: string;
  error_code?: number;
}

export interface APIResponseModel {
  error?: APIError | string;
  data?: QuestionModel | null;
}
