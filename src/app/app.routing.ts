import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { UserlayoutComponent } from "./core/userlayout/userlayout.component";
import { CanActivateViaAuthGuard } from "./modules/auth/auth-guard/auth.guard";
import { CanActivateAdminGuard } from "./modules/auth/auth-guard/adminAuth.guard";

export const routes: Routes = [
  {
    path: "",
    component: UserlayoutComponent,
    canActivate: [CanActivateViaAuthGuard],
    children: [
      {
        path: "",
        loadChildren: "./modules/activities/activities.module#ActivitiesModule",
        canActivate: [CanActivateAdminGuard],
        pathMatch: "full"
      },
      {
        path: "terms-and-conditions",
        loadChildren: "./modules/terms/terms.module#TermsContructModule",
        canActivate: [CanActivateAdminGuard]
      },
      {
        path: "update-activity",
        loadChildren:
          "./modules/update-activity-form/update-activity-form.module#ActivitiesUpdateModule",
        canActivate: [CanActivateAdminGuard]
      },
      {
        path: "user-profile",
        loadChildren: "./modules/settings/settings.module#SettingsModule",
        canActivate: [CanActivateAdminGuard]
      },

      {
        path: "configurations",
        loadChildren:
          "./modules/configurations/configurations.module#ConfigurationsModule",
        canActivate: [CanActivateAdminGuard]
      }
    ]
  },
  {
    path: "auth",
    loadChildren: "./modules/auth/auth.module#AuthModule"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
