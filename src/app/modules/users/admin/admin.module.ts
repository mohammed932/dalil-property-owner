import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../../../shared/shared.module";
import { AdminRoutingModule } from "./admin.routing";
import { AdminComponent } from "./admin.component";
import { AddNewAdminComponent } from './components/add-new-admin/add-new-admin.component';

@NgModule({
  imports: [CommonModule, SharedModule, AdminRoutingModule],
  declarations: [AdminComponent, AddNewAdminComponent],
  entryComponents: [AddNewAdminComponent]
})
export class AdminModule {}
