import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers.routing';
import { CustomersComponent } from './customers.component';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        CustomersRoutingModule
    ],
    declarations: [CustomersComponent]
})
export class CustomersModule { }
