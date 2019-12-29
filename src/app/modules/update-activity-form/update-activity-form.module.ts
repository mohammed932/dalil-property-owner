import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { UpdateActivityFormComponent } from "./update-activity-form.component";
import { SharedModule } from "../../shared/shared.module";
import { ActivitiesUpdateRoutingModule } from "./update-activity-form.routing";
@NgModule({
  imports: [CommonModule, SharedModule, ActivitiesUpdateRoutingModule],
  declarations: [UpdateActivityFormComponent],
  providers: [DatePipe],
  entryComponents: []
})
export class ActivitiesUpdateModule {}
