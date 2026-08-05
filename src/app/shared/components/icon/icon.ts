import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Names of the inline SVG icons the app ships with. */
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

/** Inline SVG icon that inherits the current text color and font size. */
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
