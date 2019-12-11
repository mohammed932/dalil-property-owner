import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
    ],
    declarations: [ EmployeeDetailsComponent]
})
export class UsersModule { }
