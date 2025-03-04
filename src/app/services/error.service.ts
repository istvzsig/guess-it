import { Injectable } from '@angular/core';

import { APIError } from '../models/api.model';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  // Method to handle application-specific errors
  public handleError(error: string | APIError) {
    console.error('Application Error:', error);
    // Display a user-friendly message in the UI
    this.showErrorMessage(
      'An error occurred while fetching the question. Please try again later.',
    );
  }

  // Method to handle HTTP error
  public handleHttpError(err: HttpErrorResponse) {
    console.error('HTTP Error:', err);
    // Display a user-friendly message based on the error status
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

  // Method to get error message based on response code
  public getErrorMessage(responseCode: number): string {
    switch (responseCode) {
      case 1:
        return 'No results found.';
      case 2:
        return 'Invalid request.';
      // Add more cases as needed
      default:
        return 'An unknown error occurred.';
    }
  }

  // Method to show error messages in the UI
  public showErrorMessage(message: string) {
    // TODO: Add UI feedback. For example a notification toast.
    console.error(message);
  }
}
