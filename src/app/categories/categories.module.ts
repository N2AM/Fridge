import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { AllCategoriesComponent } from './all-categories/all-categories.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../shared/shared.module';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoryComponent } from './category/category.component';
import { SubCategoriesComponent } from './sub-categories/sub-categories.component';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    CategoryComponent,
    AllCategoriesComponent,
    SubCategoriesComponent
  ],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    SharedModule,
    NgxUiLoaderModule,
    NgxPaginationModule
  ]
})
export class CategoriesModule {}
