import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';

import { OPEN_TDB_API_URL } from 'src/app/environments/api.environment';

import { APIRequestModel, APIResponseModel } from 'src/app/models/api.model';
import {
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
      this.randomQuestionSubject$.next(cachedQuestion);
      return;
    }

    this.fetchRandomQuestion().subscribe((response) => {
      if (response.error) {
        // TODO: Handle error in UI
        return;
      }
      if (response.data) {
        this.randomQuestionSubject$.next(response.data);
      }
    });
  }

  private fetchRandomQuestion(): Observable<APIResponseModel> {
    return this._http.get<APIRequestModel>(OPEN_TDB_API_URL).pipe(
      map((response): APIResponseModel => {
        if (response.response_code === 0) {
          console.log(response);
          const question: APIResponseQuestionModel = response.results[0];

          const newQuestion: QuestionModel = {
            id: 'asdsds', // TODO: Replace dummy identifier
            question: question.question,
            category: question.category,
            difficulty: question.difficulty,
            type: question.type,
            answers: [question.correct_answer, ...question.incorrect_answers],
          };

          console.table({ question, newQuestion });

          this._cacheService.set<QuestionModel>(newQuestion.id, newQuestion);
          return { error: '', data: newQuestion };
        }
        return {
          error: new Error('Error while fetching question.'),
          data: null,
        };
      }),
      shareReplay(1)
    );
  }
}
