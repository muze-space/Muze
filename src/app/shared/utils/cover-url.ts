import { TrackImageSize } from '../../core/enums/track-image-size.enum';

const SUPPORTED_SIZES = Object.values(TrackImageSize)
  .filter((size): size is TrackImageSize => typeof size === 'number')
  .sort((a, b) => a - b);

const WIDTH_PARAM = 'width';

export function resizeCover(url: string | null | undefined, size: number): string {
  if (!url) {
    return '';
  }

  try {
    const parsed = new URL(url);

    if (!parsed.searchParams.has(WIDTH_PARAM)) {
      return url;
    }

    parsed.searchParams.set(WIDTH_PARAM, String(snapToSupported(size)));

    return parsed.toString();
  } catch {
    return url;
  }
}

function snapToSupported(size: number): number {
  return SUPPORTED_SIZES.find((supported) => supported >= size) ?? SUPPORTED_SIZES.at(-1)!;
}
