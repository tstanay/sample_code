import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PulseComponent} from './pulse/pulse.component';
import {ManageComponent} from './manage/manage.component';
import {SupportComponent} from './support/support.component';


const routes: Routes = [
    {
        path: '',
        redirectTo: 'pulse',
        pathMatch: 'full',
    },
    {
        path: 'pulse',
        component: PulseComponent,
    },
    {
        path: 'manage',
        component: ManageComponent,
    },
    {
        path: 'support',
        component: SupportComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InfoRoutingModule {
}
