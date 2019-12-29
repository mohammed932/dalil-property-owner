import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";

import { SharedModule } from "../../shared/shared.module";
import { ActivitiesRoutingModule } from "./activities.routing";
import { ActivitiesComponent } from "./activities.component";
import { AddNewActivitiesComponent } from "./components/add-new-activities/add-new-activities.component";
import { UpdateActivitiesComponent } from "./components/update-activities/update-activities.component";
import { AddOfferActivityComponent } from "./components/add-offer/add-offer-activities.component";

@NgModule({
  imports: [CommonModule, SharedModule, ActivitiesRoutingModule],
  declarations: [
    ActivitiesComponent,
    AddOfferActivityComponent,
    AddNewActivitiesComponent,
    UpdateActivitiesComponent
  ],
  providers: [DatePipe],
  entryComponents: [
    AddNewActivitiesComponent,
    UpdateActivitiesComponent,
    AddOfferActivityComponent
  ]
})
export class ActivitiesModule {}
