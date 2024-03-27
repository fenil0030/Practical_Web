import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobDetailsComponent } from './job-list/job-details/job-details.component';
import { JobListComponent } from './job-list/job-list.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { UserRoleGuard } from '../core/guards/user-role.guard';
// import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: JobListComponent,//grid component
      },
      {
        path: ':id',
        canActivate: [UserRoleGuard],
        // canActivateChild: [UserRoleGuard],
        component: JobDetailsComponent,//details component
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }
