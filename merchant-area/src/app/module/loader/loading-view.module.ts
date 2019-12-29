import {NgModule} from '@angular/core';
import {LoadingIndicatorComponent} from './loader-view.component';

@NgModule({
    declarations: [LoadingIndicatorComponent],
    bootstrap: [LoadingIndicatorComponent],
    exports: [LoadingIndicatorComponent]
})
export class LoadingViewModule {
}
