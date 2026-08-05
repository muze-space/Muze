import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'play'
  | 'pause'
  | 'previous'
  | 'next'
  | 'shuffle'
  | 'repeat'
  | 'repeat-one'
  | 'heart'
  | 'heart-filled'
  | 'queue'
  | 'close'
  | 'volume-high'
  | 'volume-low'
  | 'volume-mute';

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.html',
  styleUrl: './icon.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  readonly name = input.required<IconName>();
}
