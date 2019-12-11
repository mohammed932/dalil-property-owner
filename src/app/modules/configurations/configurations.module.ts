import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { ConfigurationsRoutingModule } from './configurations.routing';
import { ConfigurationsComponent } from './configurations.component';
import { ChaletsComponent } from './components/chalets/chalets.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ConfigurationsRoutingModule,
    ],
    declarations: [ConfigurationsComponent, ChaletsComponent],
})
export class ConfigurationsModule { }
