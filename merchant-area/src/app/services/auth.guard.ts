import {Injectable, OnInit} from '@angular/core';
import {CanActivate, CanActivateChild, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router/src/router_state';
import {JwtAuthErrorModel, JwtAuthModel} from '../models/api.models';

@Injectable()
export class NeedAuthGuard implements CanActivate, CanActivateChild, OnInit {

    constructor(private auth: AuthService, private router: Router) {
    }

    ngOnInit() {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const is_authenticated = this.auth.isAuthenticated();
        const is_expired = this.auth.isAccessTokenExpired();

        if (is_authenticated && is_expired) {
            this.auth.refreshToken().subscribe(
                (data: JwtAuthModel) => this.auth.refreshSuccess(data.access, data.refresh),
                (err: JwtAuthErrorModel) => this.auth.loginFailed(err)
            );

            this.auth.redirect_url = state.url;

            return false;
        } else if (!is_authenticated) {
            this.router.navigate(['login']);
            return false;
        }

        return true;
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.canActivate(childRoute, state);
    }
}
