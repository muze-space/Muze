import { Injectable } from '@angular/core';

/**
 * Thin JSON wrapper around localStorage. Every read and write is guarded:
 * storage can be unavailable (private mode), hold malformed JSON left by an
 * older build, or reject writes once the quota is exhausted — none of which
 * should break the app.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  read<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : (JSON.parse(raw) as T);
    } catch {
      return fallback;
    }
  }

  write<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Quota exceeded or storage disabled — the in-memory state stays correct.
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Nothing to do.
    }
  }
}
