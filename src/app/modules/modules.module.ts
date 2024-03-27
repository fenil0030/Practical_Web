import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';

import { ModulesRoutingModule } from './modules-routing.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { JobListComponent } from './job-list/job-list.component';
import { JobDetailsComponent } from './job-list/job-details/job-details.component';
import { CustomMaterialModule } from '../shared/custom-material/custom-material.module';
// import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
// import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    ModulesRoutingModule,
    CustomMaterialModule,
    // GooglePlaceModule
    // LoginRoutingModule
  ],
  declarations: [
    LandingPageComponent,
    JobListComponent,
    JobDetailsComponent
  ]
})
export class ModulesModule {}
