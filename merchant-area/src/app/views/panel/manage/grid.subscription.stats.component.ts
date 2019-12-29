import {Component, Input, OnInit, OnDestroy, ViewEncapsulation, EventEmitter, Output} from '@angular/core';
import {GridDataResult, PageChangeEvent} from '@progress/kendo-angular-grid';
import {Observable} from 'rxjs';
import {formatDate} from '@angular/common';
import {ApiService} from '../../../services/api.service';
import {AuthService} from '../../../services/auth.service';
import {JwtAuthErrorModel, JwtAuthModel} from '../../../models/api.models';
import {animate, query, state, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'app-grid-subscription-stats',
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
            <kendo-grid-column field="from_period" title="Период" [width]="140">
                <ng-template kendoGridCellTemplate let-dataItem>
                    {{ dataItem.from_period | date:'dd.MM.yyyy' }} -
                    {{ calcToPeriod(dataItem.from_period) | date:'dd.MM.yyyy' }}
                </ng-template>
            </kendo-grid-column>
            <kendo-grid-column field="subs_count" title="Кол-во подписавшихся" [width]="120"></kendo-grid-column>
            <kendo-grid-column field="unsubs_count" title="Кол-во отписавшихся" [width]="100"></kendo-grid-column>
            <kendo-grid-column field="active_base" title="Активная база" [width]="100"></kendo-grid-column>
            <kendo-grid-column field="txs_count" title="Кол-во тарификаций" [width]="130"></kendo-grid-column>
            <kendo-grid-column field="turnover" title="Оборот" [width]="130">
                <ng-template kendoGridCellTemplate let-dataItem>
                    {{dataItem.turnover/100 | number:".2"}}
                </ng-template>
            </kendo-grid-column>
            <!--<kendo-grid-column field="incomeGP" title="Доход GP" [width]="130"></kendo-grid-column>-->
            <!--<kendo-grid-column field="incomeSFLabs" title="Доход SF Labs" [width]="130"></kendo-grid-column>-->
            <!--<kendo-grid-column field="incomeOperator" title="Доход Оператора" [width]="130"></kendo-grid-column>-->
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
export class GridSubscriptionStatsComponent implements OnInit, OnDestroy {
    gridView: GridDataResult;

    error = false;

    isAnimating = false;

    pageSize = 10;

    skip = 0;

    update_subscriber: any;

    not_binding_period: string;

    @Input('from_period') from_period: string;

    @Input('to_period') to_period: string;

    @Input('period') period: string;

    @Input('operator') operator: string;

    @Input('contractors') contractors: string[];

    @Input() update_data: Observable<void>;

    @Output() data_loaded = new EventEmitter<boolean>();
    @Output() data_reload = new EventEmitter<boolean>();

    constructor(private apiService: ApiService, private auth: AuthService) {
    }

    ngOnInit() {
        this.update_subscriber = this.update_data.subscribe(() => this.loadSubscriptionsStats(1));
        this.loadSubscriptionsStats(1);
    }

    ngOnDestroy() {
        this.update_subscriber.unsubscribe();
    }

    loadSubscriptionsStats(page: number): void {
        if (this.auth.isAccessTokenExpired()) {
            this.auth.refreshToken().subscribe(
                data => {
                    this.auth.redirect_url = '';
                    this.auth.refreshSuccess(data.access, data.refresh);
                    this.loadSubscriptionsStats(page);
                },
                err => this.auth.loginFailed(err)
            );
        } else {
            const params = {
                'page': page,
                'from_date': formatDate(this.from_period, 'yyyy-MM-dd', 'en-US'),
                'to_date': formatDate(this.to_period, 'yyyy-MM-dd', 'en-US'),
                'period': this.period,
                'operator': this.operator,
                'contractors': this.contractors.map(x => x['id']).join(','),
            };

            this.apiService.pullData('api/subscription_stats/', params).subscribe(
                subscriptions => {
                    this.not_binding_period = this.period;
                    this.error = false;
                    this.gridView = {
                        data: subscriptions['results'],
                        total: subscriptions['count']
                    };

                    this.data_loaded.emit();
                    this.isAnimating = false;
                },
                error => {
                    this.error = true;

                    this.data_loaded.emit();
                    this.isAnimating = false;
                }
            );
        }
    }

    reload() {
        this.loadSubscriptionsStats(1);
        this.data_reload.emit();
    }

    public pageChange(event: PageChangeEvent): void {
        setTimeout(() => { this.isAnimating = true; }, 1);
        this.skip = event.skip;
        this.loadSubscriptionsStats(Math.floor(this.skip / this.pageSize) + 1);
    }

    calcToPeriod(from_period) {
        const date_from = new Date(from_period);

        if (this.not_binding_period === 'month') {
            date_from.setMonth(date_from.getMonth() + 1);
        } else if (this.not_binding_period === 'week') {
            date_from.setDate(date_from.getDate() + 7);
        } else {
            date_from.setDate(date_from.getDate() + 1);
        }

        return date_from;
    }
}
