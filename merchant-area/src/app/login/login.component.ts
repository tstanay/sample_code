import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {JwtAuthErrorModel, JwtAuthModel} from '../models/api.models';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

    username: string;
    password: string;

    constructor(private auth: AuthService) {
    }

    ngOnInit() {
    }

    login(): void {
        this.auth.login(this.username, this.password).subscribe(
            (data: JwtAuthModel) => this.auth.loginSuccess(data.access, data.refresh),
            (err: JwtAuthErrorModel) => this.auth.loginFailed(err)
        );
    }

    get auth_errors() {
        return this.auth.errors;
    }

    set auth_errors(errors: boolean) {
        this.auth.errors = errors;
    }

}
