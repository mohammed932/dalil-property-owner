import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../../shared/shared.module";
import { OptionsComponent } from './options.component';
import { OptionsRoutingModule } from './options.routing';
import { AddNewOptionComponent } from './components/add-new-options/add-new-options.component';
import { UpdateOptionsComponent } from './components/update-options/update-options.component';

@NgModule({
  imports: [CommonModule, SharedModule, OptionsRoutingModule],
  declarations: [OptionsComponent, AddNewOptionComponent, UpdateOptionsComponent],
  entryComponents: [AddNewOptionComponent, UpdateOptionsComponent]
})
export class OptionsModule { }
