import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { QuestionModel } from 'src/app/models/question.model';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  public questions$ = new BehaviorSubject([
    { id: 1, text: 'What is the capital of France?', answer: 'Paris' },
    { id: 2, text: 'What is 2 + 2?', answer: '4' },
    { id: 3, text: 'What is the color of the sky?', answer: 'Blue' },
    { id: 4, text: 'Who wrote Hamlet?', answer: 'Shakespeare' },
    { id: 5, text: 'What is the boiling point of water (°C)?', answer: '100' },
  ]);

  public randomQuestion$ = new BehaviorSubject<QuestionModel>({
    id: 0,
    text: '',
    answer: '',
  });

  // Questions
  public get questions(): QuestionModel[] {
    return this.questions$.getValue();
  }

  public setRandomQuestion() {
    this.randomQuestion$.next(this.getRandomQuestion());
  }

  public getRandomQuestion() {
    const questions = this.questions;
    const randomIndex = Math.floor(Math.random() * questions.length);
    return { ...questions[randomIndex] };
  }
}
