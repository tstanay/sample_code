import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';

import {CustomMaterialModule} from './core/material.module';
import {FormsModule} from '@angular/forms';
import {LayoutModule} from '@angular/cdk/layout';
import {
    MatButtonModule, MatIconModule,
    MatListModule,
    MatSidenavModule, MatToolbarModule,
} from '@angular/material';
import {InputsModule} from '@progress/kendo-angular-inputs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import {HttpClientModule} from '@angular/common/http';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        DashboardComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CustomMaterialModule,
        FormsModule,
        LayoutModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        BrowserAnimationsModule,
        InputsModule,
        HttpClientModule,
        MatProgressSpinnerModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
