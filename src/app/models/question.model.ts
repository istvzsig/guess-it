export interface APIResponseQuestionModel {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  category: string;
  difficulty: string;
  type: string;
}

export interface QuestionModel
  extends Omit<
    APIResponseQuestionModel,
    'correct_answer' | 'incorrect_answers'
  > {
  id: string;
  answers: string[] | null;
}
