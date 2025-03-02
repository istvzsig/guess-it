export interface APIResponseQuestionModel {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  category: string;
  difficulty: string;
  type: string;
}

export enum AnswerOption {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
}

export interface Answer {
  [key: string]: string;
}

export interface QuestionModel
  extends Omit<
    APIResponseQuestionModel,
    'correct_answer' | 'incorrect_answers'
  > {
  id: string;
  answers: Answer[] | null;
}
