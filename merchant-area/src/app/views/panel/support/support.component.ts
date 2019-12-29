import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-support',
    templateUrl: './support.component.html'
})
export class SupportComponent implements OnInit {

    form: FormGroup;

    is_txs_loading = false;
    is_txs_search_done = false;
    update_txs: Subject<void> = new Subject<void>();

    is_subs_loading = false;
    is_subs_search_done = false;
    update_subs: Subject<void> = new Subject<void>();

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
        });
    }

    get phone() {
        return this.form.get('phone').value;
    }

    search() {
        this.is_txs_loading = true;
        this.is_txs_search_done = false;

        this.is_subs_loading = true;
        this.is_subs_search_done = false;

        this.update_txs.next();
        this.update_subs.next();
    }

    txs_loaded() {
        this.is_txs_loading = false;
        this.is_txs_search_done = true;
    }

    subs_loaded() {
        this.is_subs_loading = false;
        this.is_subs_search_done = true;
    }

}
