import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { CreateProductComponent } from './create-product.component';
import { CreateProductRoutingModule } from './create-product.routing';



@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        CreateProductRoutingModule
    ],
    declarations: [CreateProductComponent],
})
export class CreateProductModule { }
