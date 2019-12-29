import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatRipple} from '@angular/material';
import {Subscription} from 'rxjs';
import {ITimeValueObject} from '../../../models/ws.models';
import {WebsocketService} from '../../../services/websocket.service';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
})
export class ChartComponent implements OnInit {
    FORMAT = {
        'default': (v) => {
            return v;
        },
        'money': (v) => {
            v.value = v.value / 100;
            return v;
        }
    };

    @Input() init_event: string;
    @Input() event: string;
    @Input() icon: string;
    @Input() color: string;
    @Input() title: string;
    @Input() tooltip_title: string;
    @Input() gradient_url: string;
    @Input() format = 'default';

    partition_x = 720; // minutes
    frequency = 30; // seconds
    range = 60; // seconds
    series_number = this.range / this.frequency;

    public series: ITimeValueObject[] = [];

    data: ITimeValueObject[] = [];

    init_subscriber: Subscription;

    value_subscriber: Subscription;

    @ViewChild(MatRipple) icon_ripple: MatRipple;

    constructor (public wsService: WebsocketService) {
        for (let i = 0; i < this.partition_x; i++) {
            this.series.push({ time: new Date(), value: 0 });
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
        this.init_subscriber = this.wsService.on<ITimeValueObject[]>(this.init_event).subscribe(this.initData());
        this.value_subscriber = this.wsService.on<ITimeValueObject>(this.event).subscribe(this.getValue());
    }

    unsubscribe() {
        if (this.init_subscriber) {
            this.init_subscriber.unsubscribe();
        }
        if (this.value_subscriber) {
            this.value_subscriber.unsubscribe();
        }
    }

    initData() {
        return (init_data: ITimeValueObject[]) => {
            this.launchRipple();

            this.data = init_data.map(v => this.FORMAT[this.format](v));
            this.series = this.data.filter((_, index) => index % this.series_number === this.series_number - 1);
        };
    }

    getValue() {
        return (value: ITimeValueObject) => {
            this.launchRipple();

            this.data.push(this.FORMAT[this.format](value));
            this.series = this.data.filter((_, index) => index % this.series_number === this.series_number - 1);
        };
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
