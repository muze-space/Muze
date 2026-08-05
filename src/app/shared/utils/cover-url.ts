import { TrackImageSize } from '../../core/enums/track-image-size.enum';

const SUPPORTED_SIZES = Object.values(TrackImageSize)
  .filter((size): size is TrackImageSize => typeof size === 'number')
  .sort((a, b) => a - b);

const WIDTH_PARAM = 'width';

/**
 * Rescales a Jamendo cover URL.
 *
 * Covers come back at whatever `imagesize` the request asked for, and anything
 * saved to localStorage (liked tracks, playlists, history) keeps that width
 * forever — a 50px thumbnail looks awful blown up to 360px in the Now Playing
 * view. The size lives in the URL, so rewriting it lets every call site ask for
 * what it actually renders, previously saved data included.
 *
 * Jamendo answers arbitrary widths with a 500, so the request is snapped to the
 * nearest supported size at or above the one asked for.
 */
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
    // Not a URL we can rewrite — hand it back untouched.
    return url;
  }
}

function snapToSupported(size: number): number {
  return SUPPORTED_SIZES.find((supported) => supported >= size) ?? SUPPORTED_SIZES.at(-1)!;
}
