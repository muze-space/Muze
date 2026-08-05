import { Routes } from '@angular/router';
import { AppRoutes } from './core/enums/app-routes.enum';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: AppRoutes.Home,
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: AppRoutes.Search,
    loadComponent: () => import('./pages/search/search').then((m) => m.Search),
  },
  {
    path: AppRoutes.Library,
    loadComponent: () => import('./pages/library/library').then((m) => m.Library),
    canActivate: [authGuard],
  },
  {
    path: `${AppRoutes.Artist}/:id`,
    loadComponent: () => import('./pages/artist/artist').then((m) => m.ArtistPage),
  },
  {
    path: `${AppRoutes.Album}/:id`,
    loadComponent: () => import('./pages/album/album').then((m) => m.AlbumPage),
  },
  {
    path: `${AppRoutes.Playlist}/:id`,
    loadComponent: () => import('./pages/playlist/playlist').then((m) => m.PlaylistPage),
    canActivate: [authGuard],
  },
  {
    path: AppRoutes.About,
    loadComponent: () => import('./pages/about-us/about-us').then((m) => m.AboutUs),
  },
  {
    path: AppRoutes.NotFound,
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
  {
    path: '**',
    redirectTo: AppRoutes.NotFound,
  },
];
