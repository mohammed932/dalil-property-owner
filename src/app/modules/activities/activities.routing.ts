import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalizeRouterModule } from 'localize-router';
import { TranslateModule } from '@ngx-translate/core';
import { ActivitiesComponent } from './activities.component';
import { UpdateActivityFormComponent } from './components/update-activity-form/update-activity-form.component';


const routes: Routes = [
    {
        path: '',
        component: ActivitiesComponent
    },
    {
        path: 'update-activity/:id',
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
export class ActivitiesRoutingModule { }
