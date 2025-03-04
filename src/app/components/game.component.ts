import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DecodeHtmlPipe } from '../pipes/decodeHtml.pipe';

import { QuestionModel } from 'src/app/models/question.model';

import { LoadingService } from '../services/loading.service';
import { QuestionService } from '../services/question.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, DecodeHtmlPipe],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
// TODO: Refactor question UI stuff to component
export class GameComponent implements OnInit {
  private _loadingService = inject(LoadingService);
  private _questionService = inject(QuestionService);

  get question(): QuestionModel | null {
    return this._questionService.question$.getValue();
  }

  get isLoading(): boolean {
    return this._loadingService.isLoading$.getValue();
  }

  ngOnInit(): void {
    this.updateQuestion();
  }

  public updateQuestion(): void {
    this._questionService.setQuestion();
  }
}
