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

const DUMMY_CACHE_KEY = 'DUMMY_CACHE_KEY';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private _http = inject(HttpClient);
  private _cacheService = inject(CacheService);
  // private _errorService = inject();

  public isLoading = false;

  public questionSubject$ = new BehaviorSubject<QuestionModel | null>(null);

  public setQuestion(): void {
    const cachedQuestion: QuestionModel | undefined =
      this._cacheService.get(DUMMY_CACHE_KEY);

    if (cachedQuestion) {
      console.log('Question is set from cache:', cachedQuestion);
      this.setNextQuestion(cachedQuestion);
      return;
    }

    this.fetchRandomQuestion();
  }

  private setNextQuestion(question: QuestionModel): void {
    this.questionSubject$.next(question);
  }

  private generateQuestionId(question: APIResponseQuestionModel): string {
    return question.question.split(' ').join('').slice(0, 16);
  }

  private fetchRandomQuestion(): void {
    if (this.isLoading) {
      console.warn('Already loading question. Skipping request.');
      return;
    }

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
              // id: DUMMY_CACHE_KEY,
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
      .subscribe({
        next: (response) => {
          this.isLoading = false;

          if (response.error) {
            console.error(response.error);
            return;
          }

          if (response.data) {
            this.setNextQuestion(response.data);
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error('HTTP Error:', err);
        },
      });
  }

  private formatAnswers(answers: string[] | null): Answer[] | null {
    if (!answers || answers.length === 0) {
      console.warn('No answers available.');
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
