import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {CustomerService} from './customer.service';
import {JwtAuthModel} from '../models/api.models';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly httpOptions: object;

    public redirect_url: string = null;

    public errors: any = false;

    constructor(private http: HttpClient, private router: Router, private customer: CustomerService) {
        this.httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };
    }

    public login(username, password): Observable<JwtAuthModel> {
        return this.http.post<JwtAuthModel>(
            `${environment.api_service_url}/api/auth/token/`,
            {username: username, password: password},
            this.httpOptions
        );
    }

    public refreshToken(): Observable<JwtAuthModel> {
        return this.http.post<JwtAuthModel>(
            `${environment.api_service_url}/api/auth/token/refresh/`,
            {refresh: this.customer.refresh},
            this.httpOptions
        );
    }

    public loginSuccess(access, refresh) {
        this.errors = false;

        this.updateTokens(access, refresh);

        if (this.customer.isAuthenticated()) {
            if (this.isAccessTokenExpired()) {
                this.refreshToken();
                this.redirect_url = 'dashboard';
            } else {
                this.router.navigate(['dashboard']);
            }
        }
    }

    public loginFailed(data) {
        this.errors = data;
        this.router.navigate(['login']);
    }

    public refreshSuccess(access, refresh) {
        this.errors = false;

        if (this.isRefreshTokenExpired()) {
            this.router.navigate(['login']);
        }

        this.updateTokens(access, refresh);

        if (this.redirect_url) {
            this.router.navigate([this.redirect_url]);
        }
    }

    public logout() {
        this.customer.logout();
        this.router.navigate(['login']);
    }

    public isAccessTokenExpired(): boolean {
        const now = Math.floor(new Date().getTime() / 1000);
        return now > this.customer.access_exp;
    }

    public isRefreshTokenExpired(): boolean {
        const now = Math.floor(new Date().getTime() / 1000);
        return now > this.customer.refresh_exp;
    }

    public isAuthenticated(): boolean {
        return this.customer.isAuthenticated();
    }

    private updateTokens(access, refresh) {
        this.customer.access = access;
        this.customer.refresh = refresh;
    }

}
