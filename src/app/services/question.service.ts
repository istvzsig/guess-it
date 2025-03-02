import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { BehaviorSubject, map, shareReplay } from 'rxjs';

import { OPEN_TDB_API_URL } from 'src/app/environments/api.environment';

import { APIRequestModel, APIResponseModel } from 'src/app/models/api.model';
import {
  Answer,
  AnswerOption,
  APIResponseQuestionModel,
  QuestionModel,
} from 'src/app/models/question.model';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private _http = inject(HttpClient);
  private _cacheService = inject(CacheService);
  // private _errorService = inject();

  public randomQuestionSubject$ = new BehaviorSubject<QuestionModel | null>(
    null
  );

  public setRandomQuestion(): void {
    const cachedQuestion: QuestionModel | undefined =
      this._cacheService.get('asdsds');

    if (cachedQuestion) {
      console.log('Question is set from cache:', cachedQuestion);
      this.setNextQuestion(cachedQuestion);
      return;
    }

    this.fetchRandomQuestion();
  }

  private setNextQuestion(question: QuestionModel): void {
    this.randomQuestionSubject$.next(question);
  }

  private generateQuestionId(question: APIResponseQuestionModel): string {
    return question.question.split(' ').join('').slice(0, 16);
  }

  private fetchRandomQuestion(): void {
    this._http
      .get<APIRequestModel>(OPEN_TDB_API_URL)
      .pipe(
        map((response): APIResponseModel => {
          if (response.response_code === 0) {
            const question: APIResponseQuestionModel = response.results[0];

            const combinedAnswers = [
              question.correct_answer,
              ...question.incorrect_answers,
            ];
            this.formatAnswers(combinedAnswers);
            const newQuestion: QuestionModel = {
              id: this.generateQuestionId(question),
              question: question.question,
              category: question.category,
              difficulty: question.difficulty,
              type: question.type,
              answers: this.formatAnswers(combinedAnswers),
            };

            this._cacheService.set<QuestionModel>(newQuestion.id, newQuestion);

            return { data: newQuestion };
          }
          return {
            error: new Error('Error while fetching question.'),
          };
        }),
        shareReplay(1)
      )
      .subscribe((response) => {
        if (response.error) {
          // TODO: Handle error in UI
          // this._errorService.setError('')
          return;
        }
        if (response.data) {
          this.setNextQuestion(response.data);
        }
      });
  }

  private formatAnswers(answers: string[] | null): Answer[] | null {
    if (!answers || answers.length === 0) {
      return null;
    }

    return answers.map((answer, index) => {
      const option =
        AnswerOption[
          Object.keys(AnswerOption)[index] as keyof typeof AnswerOption
        ];

      return { [option]: answer };
    });
  }
}
