import { Routes } from '@angular/router';
import { AboutUs } from './pages/about-us/about-us';
import { Home } from './pages/home/home';
import { AppRoutes } from './core/enums/app-routes.enum';
import { Search } from './pages/search/search';
import { Library } from './pages/library/library';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: AppRoutes.Home,
    component: Home,
  },
  {
    path: AppRoutes.Search,
    component: Search,
  },
  {
    path: AppRoutes.Library,
    component: Library,
    canActivate: [authGuard],
  },
  {
    path: AppRoutes.About,
    component: AboutUs,
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
