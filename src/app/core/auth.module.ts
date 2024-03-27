import { NgModule } from '@angular/core';
import { CoreHttpService } from "./core-http.service";
import { CoreHelperService } from "./core-helper.service";
import { AuthService } from '../shared/services/auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { UserRoleGuard } from './guards/user-role.guard';

@NgModule({
    imports: [
    ],
    providers: [
        AuthService,
        CoreHttpService,
        CoreHelperService,
        UserRoleGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ]
})
export class AuthModule {
}
