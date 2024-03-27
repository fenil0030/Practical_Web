import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RouterTabs } from './router-tab/router-tabs.directive';
import { RouterTab } from './router-tab/router-tab.directive';
import { LayoutComponent } from './layout/layout.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { TopNavComponent } from './layout/top-nav/top-nav.component';
import { CustomMaterialModule } from './custom-material/custom-material.module';
import { AppLoaderComponent } from './app-loader/app-loader.component';
import { AppLoaderService } from './app-loader/app-loader.service';
import { AppConfirmService } from './app-confirm/app-confirm.service';
import { AppComfirmComponent } from './app-confirm/app-confirm.component';

@NgModule({
  imports: [CommonModule, RouterModule, FlexLayoutModule, MatToolbarModule, MatSidenavModule, MatMenuModule, MatButtonModule, MatIconModule, MatListModule, MatInputModule, CustomMaterialModule],
  declarations: [PageNotFoundComponent, RouterTabs, RouterTab, LayoutComponent, TopNavComponent, AppLoaderComponent, AppComfirmComponent],
  exports: [
    CommonModule,
    FlexLayoutModule,
    PageNotFoundComponent,
    RouterTabs,
    RouterTab,
    TopNavComponent,
    LayoutComponent,
    CustomMaterialModule,
    AppLoaderComponent,
    AppComfirmComponent
  ],
  providers: [AppLoaderService, AppConfirmService]
})
export class SharedModule { }
