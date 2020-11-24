import { AllCategoriesComponent } from "./all-categories/all-categories.component";
import { CategoryComponent } from "./category/category.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SubCategoriesComponent } from './sub-categories/sub-categories.component';

const routes: Routes = [
  { path: "", component: AllCategoriesComponent },
  { path: "sub_category/:id", component: SubCategoriesComponent  },
  { path: ":id", component: CategoryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule {}
