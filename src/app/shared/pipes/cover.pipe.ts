import { Pipe, PipeTransform } from '@angular/core';
import { resizeCover } from '../utils/cover-url';

@Pipe({ name: 'cover' })
export class CoverPipe implements PipeTransform {
  transform(url: string | null | undefined, size: number): string {
    return resizeCover(url, size);
  }
}
