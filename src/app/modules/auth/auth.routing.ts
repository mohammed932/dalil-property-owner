import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { VerfiyCodeComponent } from './verfiy-code/verfiy-code.component';
import { LocalizeRouterModule } from 'localize-router';
import { TranslateModule } from '@ngx-translate/core';
import { RegisterComponent } from './register/register.component';
import { TermsAndConditionComponent } from './terms-and-condition/terms-and-condition.component';

export const AuthRoutes: Routes = [
    {
        path: "",
        redirectTo: "login",
        pathMatch: "full"
    },
    {
        path: 'login',
        component: LoginComponent,
        data: { num: 1 }
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'terms',
        component: TermsAndConditionComponent
    },
    {
        path: 'verify-user',
        component: VerfiyCodeComponent,
        data: { num: 5 }
    }
];


@NgModule({
    imports: [
        TranslateModule,
        RouterModule.forChild(AuthRoutes),
        LocalizeRouterModule.forChild(AuthRoutes),
    ],
    exports: [RouterModule]
})
export class AuthRoutingModule { }