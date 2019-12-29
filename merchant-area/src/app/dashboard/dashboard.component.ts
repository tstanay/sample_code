import {Component} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AuthService} from '../services/auth.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

    isHandset: Observable<boolean> = this.breakpointObserver
        .observe(Breakpoints.Handset)
        .pipe(map(result => result.matches));

    constructor(private breakpointObserver: BreakpointObserver, private auth: AuthService) {
    }

    logout() {
        this.auth.logout();
    }
}
