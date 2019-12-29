import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {CustomerService} from './customer.service';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    url: string;

    constructor(private http: HttpClient, private customer: CustomerService) {
        this.url = `${environment.api_service_url}/`;
    }

    getHeaders() {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.customer.access
        });
    }

    pullData(api_method, params: object): Observable<any> {
        const headers = this.getHeaders();

        let http_params;
        if (params) {
            http_params = {headers: headers, params: params};
        } else {
            http_params = {headers: headers};
        }
        return this.http.get(this.url + api_method, http_params);
    }

    deactivateSubscription(request_id): Observable<any> {
        const headers = this.getHeaders();

        const http_options = {
            headers: headers
        };

        const http_params = {
            request_id: request_id,
            reason: 'Deactivated by merchant-area admin panel'
        };

        return this.http.post(this.url + 'api/deactivate/', http_params, http_options);
    }
}
