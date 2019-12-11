import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalizeRouterModule } from 'localize-router';
import { TranslateModule } from '@ngx-translate/core';
import { CreateProductComponent } from './create-product.component';


const routes: Routes = [
    {
        path: '',
        component: CreateProductComponent
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
export class CreateProductRoutingModule { }
