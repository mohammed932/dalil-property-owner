import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LocalizeRouterModule } from "localize-router";
import { TranslateModule } from "@ngx-translate/core";
import { UpdateActivityFormComponent } from "./update-activity-form.component";

const routes: Routes = [
  {
    path: ":id",
    component: UpdateActivityFormComponent
  }
];

@NgModule({
  imports: [
    TranslateModule,
    LocalizeRouterModule.forChild(routes),
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ActivitiesUpdateRoutingModule {}
