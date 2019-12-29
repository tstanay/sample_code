import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {ApiService} from '../../../services/api.service';

@Component({
    templateUrl: './manage.component.html',
})
export class ManageComponent implements OnInit {
    from_period: Date;
    to_period: Date;

    period = 'day';
    operator = 'all';
    turnover = 'payments';

    public contractors: any = [];
    public selected_contrs: any = [];

    is_data_loading = false;
    is_data_search_done = false;
    update_data: Subject<void> = new Subject<void>();

    constructor(private apiService: ApiService) {
        this.to_period = new Date();
        this.from_period = new Date();
        this.from_period.setMonth(this.from_period.getMonth() - 1);
    }

    ngOnInit() {
        this.is_data_loading = true;
        this.is_data_search_done = false;

        this.loadContractors();
    }

    loadContractors() {
        this.apiService.pullData('api/contractors/', {}).subscribe(
            contractors => {
                this.contractors = contractors;
                this.selected_contrs = this.contractors;
            },
            error => {
                this.contractors = [];
                this.selected_contrs = [];
            }
        );
    }

    public valueChange(value: any): void {
        this.selected_contrs = value;
    }

    emitUpdateData() {
        this.is_data_loading = true;
        this.is_data_search_done = false;

        this.update_data.next();
    }

    switch_period(type) {
        this.period = type;
    }

    switch_turnover(type) {
        this.is_data_loading = true;
        this.is_data_search_done = false;

        this.turnover = type;
    }

    switch_operator(type) {
        this.operator = type;
    }

    data_loaded() {
        this.is_data_loading = false;
        this.is_data_search_done = true;
    }

    data_reload() {
        this.is_data_loading = true;
        this.is_data_search_done = false;

        this.loadContractors();
    }
}
