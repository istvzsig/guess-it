import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _cache = new Map<string, any>();

  get<T>(key: string): T | undefined {
    return this._cache.get(key);
  }

  set<T>(key: string, value: T): void {
    this._cache.set(key, value);
  }

  clear(): void {
    this._cache.clear();
  }
}
