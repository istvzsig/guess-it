import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { BehaviorSubject, delay, map, retry, shareReplay } from 'rxjs';

import {
  DUMMY_CACHE_KEY,
  OPEN_TDB_API_URL,
} from 'src/app/environments/api.environment';

import {
  APIError,
  APIRequestModel,
  APIResponseModel,
} from 'src/app/models/api.model';
import {
  Answer,
  AnswerOption,
  APIResponseQuestionModel,
  QuestionModel,
} from 'src/app/models/question.model';

import { CacheService } from './cache.service';
import { LoadingService } from './loading.service';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private _http = inject(HttpClient);
  private _cacheService = inject(CacheService);
  private _loadingService = inject(LoadingService);
  private _errorService = inject(ErrorService);

  public question$ = new BehaviorSubject<QuestionModel | null>(null);

  public setQuestion(): void {
    const cachedQuestion: QuestionModel | undefined =
      this._cacheService.get(DUMMY_CACHE_KEY); // TODO: Fix caching

    if (cachedQuestion) {
      console.log('Question is set from cache:', cachedQuestion);
      this.setNextQuestion(cachedQuestion);
      return;
    }

    this.fetchRandomQuestion();
  }

  private setNextQuestion(question: QuestionModel): void {
    this.question$.next(question);
  }

  private generateQuestionId(question: APIResponseQuestionModel): string {
    return this.generateStringId(question.question);
  }

  private generateStringId(str: string, len = 16): string {
    return str.split(' ').join('').slice(0, len);
  }

  private createQuestionModel(
    apiQuestion: APIResponseQuestionModel,
  ): QuestionModel {
    const combinedAnswers = [
      apiQuestion.correct_answer,
      ...apiQuestion.incorrect_answers,
    ];

    return {
      id: this.generateQuestionId(apiQuestion),
      // id: DUMMY_CACHE_KEY, // Debug
      question: apiQuestion.question,
      category: apiQuestion.category,
      difficulty: apiQuestion.difficulty,
      type: apiQuestion.type,
      answers: this.shuffleAnswers(combinedAnswers),
    };
  }

  private shuffleAnswers(answers: string[]): Answer[] | null {
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }

    return this.formatAnswers(answers);
  }

  private fetchRandomQuestion(): void {
    if (this._loadingService.isLoading$.getValue()) {
      console.warn('Skipping duplicate request.');

      return;
    }

    this._loadingService.setLoading(true);

    this._http
      .get<APIRequestModel>(OPEN_TDB_API_URL)
      .pipe(
        // retry(5),
        map((response): APIResponseModel => {
          this._loadingService.setLoading(false); // Ensure loading is stopped regardless of response

          if (response.response_code === 0) {
            const question: APIResponseQuestionModel = response.results[0];
            const newQuestion = this.createQuestionModel(question);
            this._cacheService.set<QuestionModel>(newQuestion.id, newQuestion);
            return { data: newQuestion };
          }

          // Handle specific response codes if needed
          const errorMessage = this._errorService.getErrorMessage(
            response.response_code,
          );
          return {
            error: new Error(errorMessage),
          };
        }),
        shareReplay(1),
      )
      .subscribe({
        next: (response) => {
          if (response.error) {
            this._errorService.handleError(response.error); // Handle the error in a dedicated method
            return;
          }

          if (response.data) {
            this.setNextQuestion(response.data);
          }
        },
        error: (err) => {
          this._loadingService.setLoading(false); // Stop loading on HTTP error
          this._errorService.handleHttpError(err); // Handle HTTP errors in a dedicated method
        },
      });
  }

  private formatAnswers(answers: string[] | null): Answer[] | null {
    if (!answers || answers.length === 0) {
      console.warn('No answers available.');
      return null;
    }

    return answers.map((answer, index) => {
      const optionKeys = Object.keys(AnswerOption) as Array<
        keyof typeof AnswerOption
      >;

      if (index >= 0 && index < optionKeys.length) {
        const optionKey = optionKeys[index];
        const option = AnswerOption[optionKey];
        return { [option]: answer };
      } else {
        return {};
        // TODO: Handle the case where index is out of bounds
      }
    });
  }
}
