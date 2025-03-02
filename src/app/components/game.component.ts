import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subscription } from 'rxjs';

import { QuestionService } from '../services/question.service';
import { QuestionModel } from 'src/app/models/question.model';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit, OnDestroy {
  private _questionService = inject(QuestionService);
  private subscription: Subscription = new Subscription();

  public randomQuestion: QuestionModel | null = null;

  constructor() {
    this._questionService.setRandomQuestion();
  }

  ngOnInit(): void {
    this.subscription = this._questionService.randomQuestionSubject$.subscribe(
      (question) => {
        this.randomQuestion = question;
      }
    );
  }

  public updateNextQuestion(): void {
    this._questionService.setRandomQuestion();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
