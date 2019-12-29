import {Component, Input, OnInit, OnDestroy, ViewEncapsulation, EventEmitter, Output} from '@angular/core';
import {GridDataResult, PageChangeEvent} from '@progress/kendo-angular-grid';
import {ApiService} from '../../../services/api.service';
import {Observable} from 'rxjs';
import {AuthService} from '../../../services/auth.service';
import {JwtAuthErrorModel, JwtAuthModel} from '../../../models/api.models';
import {animate, query, state, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'app-grid-transactions',
    encapsulation: ViewEncapsulation.None,
    template: `
        <kendo-grid
            [data]="gridView"
            [pageSize]="pageSize"
            [pageable]="true"
            [sortable]="false"
            [navigable]="true"
            [skip]="skip"
            (pageChange)="pageChange($event)"
            [@nextPage]="isAnimating ? 'fade' : 'normal'"
            *ngIf="!error">
            <kendo-grid-column field="payment_at" title="Дата тарификации" [width]="120">
              <ng-template kendoGridCellTemplate let-dataItem>
                {{ dataItem.payment_at | date:'dd.MM.yyyy HH:mm:ss' }}
              </ng-template>
            </kendo-grid-column>
            <kendo-grid-column field="amount" title="Сумма" [width]="60">
                <ng-template kendoGridCellTemplate let-dataItem>
                    {{dataItem.turnover/100 | number:".2"}}
                </ng-template>
            </kendo-grid-column>
            <kendo-grid-column field="service_title" title="Сервис" [width]="100"></kendo-grid-column>
            <kendo-grid-column field="status" title="Статус" [width]="100">
              <ng-template kendoGridCellTemplate let-dataItem>
                {{ dataItem.status ? 'Оплачен' : 'Не оплачен' }}
              </ng-template>
            </kendo-grid-column>
            <kendo-grid-column field="is_subscription" title="Вид списания" [width]="130">
              <ng-template kendoGridCellTemplate let-dataItem>
                {{ dataItem.is_subscription ? 'Подписка' : 'Разовое списание' }}
              </ng-template>
            </kendo-grid-column>
            <ng-template kendoGridNoRecordsTemplate>
                Оплат не производилось
            </ng-template>
        </kendo-grid>
        <div *ngIf="error">
            Ошибка при получении данных с сервера, попробуйте <button class="btn btn-link p-0" (click)="reload()">еще раз</button>
        </div>
    `,
    animations: [
        trigger('nextPage', [
            state('normal', style({opacity: 1})),
            state('fade', style({opacity: 0})),
            transition('normal => fade', [
                query('kendo-grid-list', [
                    animate(300)
                ])
            ]),
        ])
    ]
})
export class GridTransactionsComponent implements OnInit, OnDestroy {
    gridView: GridDataResult;

    error = false;

    isAnimating = false;

    pageSize = 10;

    skip = 0;

    update_txs_subscriber: any;

    @Input('phone') phone: string;

    @Input() update_txs: Observable<void>;

    @Output() txs_loaded = new EventEmitter<boolean>();
    @Output() txs_reload = new EventEmitter<boolean>();

    constructor(private apiService: ApiService, private auth: AuthService) {
    }

    ngOnInit() {
        this.update_txs_subscriber = this.update_txs.subscribe(() => this.loadTransactions(1));
    }

    ngOnDestroy() {
        this.update_txs_subscriber.unsubscribe();
    }

    loadTransactions(page: number): void {
        if (this.auth.isAccessTokenExpired()) {
            this.auth.refreshToken().subscribe(
                data => {
                    this.auth.redirect_url = '';
                    this.auth.refreshSuccess(data.access, data.refresh);
                    this.loadTransactions(page);
                },
                err => this.auth.loginFailed(err)
            );
        } else {
            const params = {
                'page': page,
                'search': '994' + this.phone,
            };

            this.apiService.pullData('api/transactions/', params).subscribe(
                transactions => {
                    this.error = false;
                    this.gridView = {
                        data: transactions['results'],
                        total: transactions['count']
                    };
                    this.txs_loaded.emit();
                    this.isAnimating = false;
                },
                error => {
                    this.error = true;

                    this.txs_loaded.emit();
                    this.isAnimating = false;
                }
            );
        }
    }

    reload() {
        this.loadTransactions(1);
        this.txs_reload.emit();
    }

    public pageChange(event: PageChangeEvent): void {
        setTimeout(() => { this.isAnimating = true; }, 1);
        this.skip = event.skip;
        this.loadTransactions(Math.floor(this.skip / this.pageSize) + 1);
    }

}
