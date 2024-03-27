import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { LandingPageComponent } from './modules/landing-page/landing-page.component';
import { NoAuthGuard } from './core/guards/noAuth.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: LandingPageComponent
      }
    ],
  },
  {
    path: 'jobs',
    component: LayoutComponent,
    loadChildren: () =>
      import('./modules/modules.module').then((m) => m.ModulesModule),
    // canActivate: [AuthGuard],
  },
  {
    path: 'login',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
