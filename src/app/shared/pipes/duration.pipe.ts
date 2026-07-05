import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(durationInSeconds: number): string {
    if (!Number.isFinite(durationInSeconds) || durationInSeconds < 0) {
      return '0:00';
    }

    const totalSeconds = Math.floor(durationInSeconds);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}
