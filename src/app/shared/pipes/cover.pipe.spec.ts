import { CoverPipe } from './cover.pipe';

const JAMENDO_COVER = 'https://usercontent.jamendo.com/?type=album&id=24&width=50&trackid=168';

describe('CoverPipe', () => {
  const pipe = new CoverPipe();

  function widthOf(url: string): string | null {
    return new URL(url).searchParams.get('width');
  }

  it('rewrites the width of a Jamendo cover URL', () => {
    expect(widthOf(pipe.transform(JAMENDO_COVER, 300))).toBe('300');
  });

  it('keeps the other query params intact', () => {
    const params = new URL(pipe.transform(JAMENDO_COVER, 300)).searchParams;

    expect(params.get('type')).toBe('album');
    expect(params.get('id')).toBe('24');
    expect(params.get('trackid')).toBe('168');
  });

  it('snaps to the next supported size, since Jamendo rejects arbitrary widths', () => {
    expect(widthOf(pipe.transform(JAMENDO_COVER, 260))).toBe('300');
    expect(widthOf(pipe.transform(JAMENDO_COVER, 1))).toBe('25');
  });

  it('caps at the largest supported size', () => {
    expect(widthOf(pipe.transform(JAMENDO_COVER, 5000))).toBe('600');
  });

  it('scales down as well as up', () => {
    expect(widthOf(pipe.transform(JAMENDO_COVER.replace('width=50', 'width=600'), 100))).toBe('100');
  });

  it('returns an empty string for a missing URL', () => {
    expect(pipe.transform(null, 300)).toBe('');
    expect(pipe.transform(undefined, 300)).toBe('');
    expect(pipe.transform('', 300)).toBe('');
  });

  it('leaves URLs without a width param and non-URLs alone', () => {
    expect(pipe.transform('https://example.com/cover.jpg', 300)).toBe(
      'https://example.com/cover.jpg',
    );
    expect(pipe.transform('not a url', 300)).toBe('not a url');
  });
});
