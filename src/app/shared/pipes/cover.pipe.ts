import { Pipe, PipeTransform } from '@angular/core';
import { resizeCover } from '../utils/cover-url';

/** Template wrapper around {@link resizeCover}: `track.album_image | cover: 300`. */
@Pipe({ name: 'cover' })
export class CoverPipe implements PipeTransform {
  transform(url: string | null | undefined, size: number): string {
    return resizeCover(url, size);
  }
}
