import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalizeRouterModule } from 'localize-router';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigurationsComponent } from './configurations.component';


const routes: Routes = [
    {
        path: '',
        component: ConfigurationsComponent
    },
];

@NgModule({
    imports: [
        TranslateModule,
        LocalizeRouterModule.forChild(routes),
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
})
export class ConfigurationsRoutingModule { }
