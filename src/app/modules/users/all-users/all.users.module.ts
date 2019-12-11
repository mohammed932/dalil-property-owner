import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../../../shared/shared.module";
import { AllUsersComponent } from "./all.users.component";
import { AllUsersRoutingModule } from './all.users.routing';
import { AddNewUserComponent } from './components/add-new-user/add-new-user.component';

@NgModule({
  imports: [CommonModule, SharedModule, AllUsersRoutingModule],
  declarations: [AllUsersComponent, AddNewUserComponent],
  entryComponents: [AddNewUserComponent]
})
export class AllUsersModule {}
