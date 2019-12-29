import {Injectable} from '@angular/core';
import {CanActivate, CanActivateChild, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router/src/router_state';

@Injectable()
export class ForbiddenLoginGuard implements CanActivate {

    constructor(private auth: AuthService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const is_authenticated = this.auth.isAuthenticated();
        const is_expired = this.auth.isAccessTokenExpired();

        if (is_authenticated && !is_expired && (state.url === '/login')) {
            this.router.navigate(['dashboard']);
            return false;
        }

        return true;
    }

}
