export interface TrackGenre {
  value: string;
  label: string;
}

// Hardcoded because the API doesn't provide a way to fetch available genres
export const TRACK_GENRES: TrackGenre[] = [
  { value: 'lounge', label: 'Lounge' },
  { value: 'classical', label: 'Classical' },
  { value: 'electronic', label: 'Electronic' },
  { value: 'jazz', label: 'Jazz' },
  { value: 'pop', label: 'Pop' },
  { value: 'hiphop', label: 'Hip-Hop' },
  { value: 'relaxation', label: 'Relaxation' },
  { value: 'rock', label: 'Rock' },
  { value: 'songwriter', label: 'Songwriter' },
  { value: 'world', label: 'World' },
  { value: 'metal', label: 'Metal' },
  { value: 'soundtrack', label: 'Soundtrack' },
];
