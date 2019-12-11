import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../../shared/shared.module";
import { CategoriesComponent } from './categories.component';
import { CategoriesRoutingModule } from './categories.routing';
import { AddNewCategoryComponent } from './components/add-new-category/add-new-category.component';
import { AddNewCategoryItemComponent } from './components/add-new-category-item/add-new-category-item.component';
import { UpdateCategoryComponent } from './components/update-category/update-category.component';
import { UpdateCategoryItemComponent } from './components/update-category-item/update-category-item.component';

@NgModule({
  imports: [CommonModule, SharedModule, CategoriesRoutingModule],
  declarations: [CategoriesComponent, AddNewCategoryComponent, AddNewCategoryItemComponent, UpdateCategoryComponent, UpdateCategoryItemComponent],
  entryComponents: [AddNewCategoryComponent, AddNewCategoryItemComponent, UpdateCategoryComponent, UpdateCategoryItemComponent]
})
export class CategoriesModule { }
