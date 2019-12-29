import {Component, Input, OnInit, OnDestroy, ViewEncapsulation, EventEmitter, Output, NgZone, ViewChild} from '@angular/core';
import {GridDataResult, PageChangeEvent} from '@progress/kendo-angular-grid';
import {ApiService} from '../../../services/api.service';
import {Observable} from 'rxjs';
import {AuthService} from '../../../services/auth.service';
import {JwtAuthErrorModel, JwtAuthModel} from '../../../models/api.models';
import {animate, query, state, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'app-grid-subscriptions',
    encapsulation: ViewEncapsulation.None,
    template: `
        <kendo-grid
            #grid
            [data]="gridView"
            [pageSize]="pageSize"
            [pageable]="true"
            [navigable]="true"
            [skip]="skip"
            (pageChange)="pageChange($event)"
            [@nextPage]="isAnimating ? 'fade' : 'normal'"
            *ngIf="!error">
            <kendo-grid-column field="activated_at" title="Дата активации" [width]="200">
                <ng-template kendoGridCellTemplate let-dataItem>
                    {{ dataItem.activated_at | date:'dd.MM.yyyy HH:mm:ss' }}
                </ng-template>
            </kendo-grid-column>
            <kendo-grid-column field="deactivated_at" title="Дата деактивации" [width]="200">
                <ng-template kendoGridCellTemplate let-dataItem>
                    {{ dataItem.deactivated_at | date:'dd.MM.yyyy HH:mm:ss' }}
                </ng-template>
            </kendo-grid-column>
            <kendo-grid-column field="service_title" title="Сервис" [width]="200"></kendo-grid-column>
            <kendo-grid-column field="is_active" title="">
                <ng-template kendoGridCellTemplate let-dataItem>
                    <button mat-button color="warn" (click)="deactivateSubscription(dataItem)" [disabled]="!dataItem.is_active">
                        {{ dataItem.is_active ? 'Отключить' : 'Отключена' }}
                    </button>
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
export class GridSubscriptionsComponent implements OnInit, OnDestroy {
    gridView: GridDataResult;

    error = false;

    isAnimating = false;

    pageSize = 10;

    skip = 0;

    update_subs_subscriber: any;

    @Input('phone') phone: string;

    @Input() update_subs: Observable<void>;

    @Output() subs_loaded = new EventEmitter<boolean>();
    @Output() subs_reload = new EventEmitter<boolean>();

    constructor(private apiService: ApiService, private auth: AuthService) {
    }

    ngOnInit() {
        this.update_subs_subscriber = this.update_subs.subscribe(
            () => this.loadSubscriptions(1)
        );
    }

    ngOnDestroy() {
        this.update_subs_subscriber.unsubscribe();
    }

    loadSubscriptions(page: number): void {
        if (this.auth.isAccessTokenExpired()) {
            this.auth.refreshToken().subscribe(
                data => {
                    this.auth.redirect_url = '';
                    this.auth.refreshSuccess(data.access, data.refresh);
                    this.loadSubscriptions(page);
                },
                err => this.auth.loginFailed(err)
            );
        } else {
            const params = {
                'page': page,
                'search': '994' + this.phone,
            };

            this.apiService.pullData('api/subscriptions/', params).subscribe(
                subscriptions => {
                    this.error = false;
                    this.gridView = {
                        data: subscriptions['results'],
                        total: subscriptions['count']
                    };
                    this.subs_loaded.emit();
                    this.isAnimating = false;
                },
                error => {
                    this.error = true;

                    this.subs_loaded.emit();
                    this.isAnimating = false;
                }
            );
        }
    }

    reload() {
        this.loadSubscriptions(1);
        this.subs_reload.emit();
    }

    public pageChange(event: PageChangeEvent): void {
        setTimeout(() => { this.isAnimating = true; }, 1);
        this.skip = event.skip;
        this.loadSubscriptions(Math.floor(this.skip / this.pageSize) + 1);
    }

    deactivateSubscription(dataItem) {
        this.apiService.deactivateSubscription(dataItem.request_id).subscribe(
            result => {
                dataItem.is_active = false;
                dataItem.deactivated_at = new Date();
            }
        );
    }

}
