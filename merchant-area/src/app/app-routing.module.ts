import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LoginComponent} from './login/login.component';
import {ChartsModule} from '@progress/kendo-angular-charts';
import {NeedAuthGuard} from './services/auth.guard';
import {ForbiddenLoginGuard} from './services/forbidden_login.guard';

import 'hammerjs';


const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [NeedAuthGuard],
        canActivateChild: [NeedAuthGuard],
        children: [{
            path: '',
            loadChildren: './views/panel/info.module#InfoModule',
        }]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [ForbiddenLoginGuard],
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];


@NgModule({
    imports: [
        RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'}),
        ChartsModule
    ],
    exports: [RouterModule],
    declarations: [],
    providers: [NeedAuthGuard, ForbiddenLoginGuard]
})
export class AppRoutingModule {
}
