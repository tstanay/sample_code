import { Injectable } from '@angular/core';

const ACCESS = 'MERCHANT_ACCESS';
const REFRESH = 'MERCHANT_REFRESH';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

    get access() {
        return localStorage.getItem(ACCESS);
    }

    set access(access: string) {
        localStorage.setItem(ACCESS, access);
    }

    get refresh() {
        return localStorage.getItem(REFRESH);
    }

    set refresh(refresh: string) {
        localStorage.setItem(REFRESH, refresh);
    }

    get user_id() {
        return this.getPropFromLS(ACCESS, 'user_id');
    }

    get access_exp() {
        return this.getPropFromLS(ACCESS, 'exp');
    }

    get refresh_exp() {
        return this.getPropFromLS(REFRESH, 'exp');
    }

    public isAuthenticated(): boolean {
        const user_id = this.user_id;
        return user_id && Number(user_id) > 0;
    }

    logout() {
        localStorage.removeItem(ACCESS);
        localStorage.removeItem(REFRESH);
    }

    private getPropFromLS(token_name, prop) {
        const token = localStorage.getItem(token_name);

        if (token) {
            return this.decodeToken(token)[prop];
        }

        return null;
    }

    private decodeToken(token) {
        return JSON.parse(window.atob(token.split(/\./)[1]));
    }

}
