import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatRipple} from '@angular/material';
import {Subscription} from 'rxjs';
import {ITimeValueObject} from '../../../models/ws.models';
import {WebsocketService} from '../../../services/websocket.service';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
})
export class ChartsComponent implements OnInit {
    FORMAT = {
        'default': (v) => {
            return v;
        },
        'money': (v) => {
            v.value = v.value / 100;
            return v;
        }
    };

    @Input() icon: string;
    @Input() title: string;

    @Input() init_event1: string;
    @Input() event1: string;
    @Input() color1: string;
    @Input() format1 = 'default';
    @Input() tooltip_title1: string;

    @Input() init_event2: string;
    @Input() event2: string;
    @Input() color2: string;
    @Input() tooltip_title2: string;
    @Input() format2 = 'default';

    _partition_x = 720; // minutes
    get partition_x() { return this._partition_x; }

    _frequency = 30; // seconds
    get frequency() { return this._frequency; }

    _range = 60; // seconds
    get range() { return this._range; }

    get series_number() { return this.range / this.frequency; }

    public series1: ITimeValueObject[] = [];
    public series2: ITimeValueObject[] = [];

    data1: ITimeValueObject[] = [];
    init_subscriber1: Subscription;
    value_subscriber1: Subscription;

    data2: ITimeValueObject[] = [];
    init_subscriber2: Subscription;
    value_subscriber2: Subscription;

    @ViewChild(MatRipple) icon_ripple: MatRipple;

    constructor (public wsService: WebsocketService) {
        for (let i = 0; i < this.partition_x; i++) {
            this.series1.push({ time: new Date(), value: 0 });
            this.series2.push({ time: new Date(), value: 0 });
        }
    }

    ngOnInit() {
        this.wsService.status.subscribe(this.wsStatusChanged());
    }

    wsStatusChanged() {
        return (is_connected) => {
            is_connected ? this.subscribe.call(this) : this.unsubscribe.call(this);
        };
    }

    subscribe() {
        this.init_subscriber1 = this.wsService.on<ITimeValueObject[]>(this.init_event1).subscribe(this.initData('transactions'));
        this.value_subscriber1 = this.wsService.on<ITimeValueObject>(this.event1).subscribe(this.getValue('transactions'));

        this.init_subscriber2 = this.wsService.on<ITimeValueObject[]>(this.init_event2).subscribe(this.initData('turnovers'));
        this.value_subscriber2 = this.wsService.on<ITimeValueObject>(this.event2).subscribe(this.getValue('turnovers'));
    }

    unsubscribe() {
        if (this.init_subscriber1) {
            this.init_subscriber1.unsubscribe();
        }
        if (this.value_subscriber1) {
            this.value_subscriber2.unsubscribe();
        }
        if (this.init_subscriber2) {
            this.init_subscriber1.unsubscribe();
        }
        if (this.value_subscriber2) {
            this.value_subscriber2.unsubscribe();
        }
    }

    initData(graph) {
        if (graph === 'transactions') {
            return (init_data: ITimeValueObject[]) => {
                this.launchRipple();

                this.data1 = init_data.map(v => this.FORMAT[this.format1](v));
                this.series1 = this.data1.filter((_, index) => index % this.series_number === this.series_number - 1);
            };
        } else {
            return (init_data: ITimeValueObject[]) => {
                this.launchRipple();

                this.data2 = init_data.map(v => this.FORMAT[this.format2](v));
                this.series2 = this.data2.filter((_, index) => index % this.series_number === this.series_number - 1);
            };
        }
    }

    getValue(graph) {
        if (graph === 'transactions') {
            return (value: ITimeValueObject) => {
                this.launchRipple();

                this.data1.push(this.FORMAT[this.format1](value));
                this.series1 = this.data1.filter((_, index) => index % this.series_number === this.series_number - 1);
            };
        } else {
            return (value: ITimeValueObject) => {
                this.launchRipple();

                this.data2.push(this.FORMAT[this.format2](value));
                this.series2 = this.data2.filter((_, index) => index % this.series_number === this.series_number - 1);
            };
        }
    }

    launchRipple() {
        this.icon_ripple.launch({
            centered: true,
            color: '#ffffff',
            radius: 5,
        });
    }

    convertDate(e: any) {
        return formatDate(e.value, 'HH:mm', 'en');
    }
}
