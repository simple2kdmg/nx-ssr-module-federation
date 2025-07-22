import { NxWelcomeComponent } from './nx-welcome.component';
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'main-app',
    loadChildren: () => import('main-app/Routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'login-app',
    loadChildren: () => import('login-app/Routes').then((m) => m.remoteRoutes),
  },
  {
    path: '',
    component: NxWelcomeComponent,
  },
];
