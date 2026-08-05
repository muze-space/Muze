import { inject, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../constants/storage-keys.const';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storage = inject(StorageService);
  private readonly _isAuthenticated = signal(
    this.storage.read<boolean>(STORAGE_KEYS.isAuthenticated, false),
  );
  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  login(): void {
    this._isAuthenticated.set(true);
    this.storage.write(STORAGE_KEYS.isAuthenticated, true);
  }

  logout(): void {
    this._isAuthenticated.set(false);
    this.storage.remove(STORAGE_KEYS.isAuthenticated);
  }
}
