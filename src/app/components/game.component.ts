import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subscription } from 'rxjs';

import { QuestionService } from '../services/question.service';
import { QuestionModel } from 'src/app/models/question.model';
import { DecodeHtmlPipe } from '../pipes/decodeHtml.pipe';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, DecodeHtmlPipe],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit, OnDestroy {
  private _questionService = inject(QuestionService);

  private _questionSubscription: Subscription = new Subscription();

  public question: QuestionModel | null = null;

  constructor() {
    this._questionService.setQuestion();
  }

  ngOnInit(): void {
    this._questionSubscription =
      this._questionService.questionSubject$.subscribe((question) => {
        this.question = question;
      });
  }

  public updateQuestion(): void {
    this._questionService.setQuestion();
  }

  ngOnDestroy(): void {
    this._questionSubscription.unsubscribe();
  }
}
