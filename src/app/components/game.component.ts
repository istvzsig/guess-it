import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../src/app/services/question.service';
import { QuestionModel } from 'src/app/models/question.model';
import { map } from 'rxjs';

@Component({
  selector: 'app-game',
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {
  private _questionService = inject(QuestionService);

  public randomQuestion: QuestionModel | null = null;

  constructor() {
    this._questionService.setRandomQuestion();
    this.randomQuestion = this._questionService.randomQuestion$.getValue();
  }

  public updateNextQuestion(): void {
    this._questionService.setRandomQuestion();
    this.randomQuestion = this._questionService.randomQuestion$.getValue();
  }
}
