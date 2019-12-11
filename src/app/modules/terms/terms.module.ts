import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../../shared/shared.module";
import { TermsComponent } from './terms.component';
import { TermsRoutingModule } from './terms.routing';
@NgModule({
  imports: [CommonModule, SharedModule, TermsRoutingModule],
  declarations: [TermsComponent],
})
export class TermsContructModule { }
