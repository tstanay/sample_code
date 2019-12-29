import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {PulseComponent} from './pulse/pulse.component';
import {ManageComponent} from './manage/manage.component';
import {InfoRoutingModule} from './info-routing.module';
import {ChartsModule} from '@progress/kendo-angular-charts';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MatButtonModule,
    MatIconModule,
    MatNativeDateModule,
} from '@angular/material';
import {SupportComponent} from './support/support.component';
import {CommonModule} from '@angular/common';
import {NgxMaskModule} from 'ngx-mask';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoadingViewModule} from '../../module/loader/loading-view.module';
import {GridModule} from '@progress/kendo-angular-grid';
import {DropDownsModule} from '@progress/kendo-angular-dropdowns';
import {APP_DATE_FORMATS, AppDateAdapter} from './manage/datepicker.adapter';
import {GridSubscriptionStatsComponent} from './manage/grid.subscription.stats.component';
import {GridPaymentStatsComponent} from './manage/grid.payment.stats.component';
import {GridTransactionsComponent} from './support/grid.transactions.component';
import {GridSubscriptionsComponent} from './support/grid.subscriptions.component';
import {WebsocketModule} from '../../module/websocket/websocket.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRippleModule} from '@angular/material/core';
import {ChartComponent} from './pulse/chart.component';
import {ChartsComponent} from './pulse/charts.component';
import {IntlModule} from '@progress/kendo-angular-intl';
import {environment} from '../../../environments/environment';

@NgModule({
    imports: [
        InfoRoutingModule,
        ChartsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        CommonModule,
        NgxMaskModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        LoadingViewModule,
        GridModule,
        DropDownsModule,
        MatButtonModule,
        WebsocketModule.config({
            url: `${environment.ws_service_url}/`
        }),
        MatProgressSpinnerModule,
        MatRippleModule,
        IntlModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [
        PulseComponent,
        ManageComponent,
        SupportComponent,
        GridSubscriptionStatsComponent,
        GridPaymentStatsComponent,
        GridTransactionsComponent,
        GridSubscriptionsComponent,
        ChartComponent,
        ChartsComponent,
    ],
    bootstrap: [
        PulseComponent,
    ],
    providers: [
        {provide: DateAdapter, useClass: AppDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
    ],
})
export class InfoModule {
}
