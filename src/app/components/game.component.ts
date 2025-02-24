import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { QuestionModel } from '../models/question.mode';

@Component({
  selector: 'app-game',
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {
  public questions$ = new BehaviorSubject([
    { id: 1, text: 'What is the capital of France?', answer: 'Paris' },
    { id: 2, text: 'What is 2 + 2?', answer: '4' },
    { id: 3, text: 'What is the color of the sky?', answer: 'Blue' },
    { id: 4, text: 'Who wrote Hamlet?', answer: 'Shakespeare' },
    { id: 5, text: 'What is the boiling point of water (°C)?', answer: '100' },
  ]);

  public randomQuestion$ = new BehaviorSubject<QuestionModel | null>(null);

  constructor() {
    this.setRandomQuestion();
  }

  // Questions
  public get questions(): QuestionModel[] {
    return this.questions$.getValue();
  }

  public get randomQuestion(): QuestionModel | null {
    return this.randomQuestion$.getValue();
  }

  public getRandomQuestion() {
    const questions = this.questions;
    const randomIndex = Math.floor(Math.random() * questions.length);
    return { ...questions[randomIndex] }; // ✅ Create a new object reference
  }

  public setRandomQuestion() {
    this.randomQuestion$.next(this.getRandomQuestion());
  }
}
