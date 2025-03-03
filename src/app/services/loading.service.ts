import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  public isLoading$ = new BehaviorSubject<boolean>(false);

  public setLoading(state: boolean): void {
    this.isLoading$.next(state);
  }
}
