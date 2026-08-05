# Muze

## Muze - Music Streaming Service

A music streaming service clone where the user can search for tracks and artists, listen to music, build playlists, and maintain a favorites library.

Application is deployed [here](https://muze-space.github.io/Muze/)

A short video (~1 min) demonstrating the 404, loading, and error states is available [here](https://drive.google.com/file/d/1knDmhkg8drqpLZzFq55UdSBIF1qz2B2c/view?usp=sharing)

## Features

- **Discover** — popular tracks, new releases, genre tags and a "Jump back in" shelf of recently played tracks
- **Search** — debounced search by query or genre, with recent searches remembered
- **Player** — play/pause, previous/next, seek, volume with mute, shuffle, repeat (off / all / one), and a full-screen Now Playing view
- **Queue** — a side panel listing what plays next, with drag-and-drop reordering, "Add to queue" and "Play next"
- **Playlists** — create, rename, delete, and add tracks from the ⋯ menu on any row
- **Library** — liked tracks, playlists and followed artists, split across tabs
- **Artists & albums** — artist pages with albums and top tracks, album pages, and Play / Shuffle on each
- **Session** — the queue, position, volume and player modes are restored after a reload, and OS media keys control playback

There is no backend: everything the user owns (liked tracks, playlists, followed artists, history, player state) lives in `localStorage`. The login dialog and the feedback form are demos, and say so in the UI.

## Developers team

### Vladyslava Nikitchenko

- github : [vladaworkflow-ops](https://github.com/vladaworkflow-ops)

- github-2 :[vlaru](https://github.com/vlaru)
- discord: @vladaworkflow_ops
- mail: vlada.work.flow@gmail.com

### Ihar Leshchanka

- github : [ileshchanka](https://github.com/ileshchanka)

- discord: @ileshchanka
- mail: ihar.leshchanka@gmail.com

## API

### [Jamendo API](https://developer.jamendo.com/v3.0/docs)

## Tech Stack

#### - Angular version 22.0 (standalone components, signals)
#### - TS version 6.0
#### - Vitest for unit tests, ESLint + Prettier, plain CSS (no UI kit)

## Development server

Clone the repository
```
git clone https://github.com/muze-space/Muze.git
```

Navigate to the project directory
```
cd Muze
```

Install dependencies
```
npm i
```

To start a local development server, run:

```bash
ng serve
```

After starting the server, open:
```
http://localhost:4200
```

## Building

To build the project run:

```bash
ng build
```

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```
