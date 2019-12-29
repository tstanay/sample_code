import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {WebsocketService} from '../../services/websocket.service';
import {WebSocketConfig} from './websocket.interfaces';
import {config} from './websocket.config';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],
    providers: [
        WebsocketService
    ]
})
export class WebsocketModule {
    public static config(wsConfig: WebSocketConfig): ModuleWithProviders {
        return {
            ngModule: WebsocketModule,
            providers: [{ provide: config, useValue: wsConfig }]
        };
    }
}
