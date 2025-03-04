import { Injectable } from '@angular/core';

import { APIError } from '../models/api.model';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  public handleError(error: string | APIError) {
    console.error('Application Error:', error);
    this.showErrorMessage(
      'An error occurred while fetching the question. Please try again later.',
    );
  }

  public handleHttpError(err: HttpErrorResponse) {
    console.error('HTTP Error:', err);
    if (err.status === 429) {
      this.showErrorMessage(
        'Too many requests. Please wait a moment and try again.',
      );
    } else {
      this.showErrorMessage(
        'An unexpected error occurred. Please try again later.',
      );
    }
  }

  public getErrorMessage(responseCode: number): string {
    switch (responseCode) {
      case 1:
        return 'No results found.';
      case 2:
        return 'Invalid request.';
      default:
        return 'An unknown error occurred.';
    }
  }

  public showErrorMessage(message: string) {
    // TODO: Add UI feedback. For example a notification toast.
    console.error(message);
    alert(message);
  }
}
