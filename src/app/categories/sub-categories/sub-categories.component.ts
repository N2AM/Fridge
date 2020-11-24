import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Category } from "./../../models/category.model";
import { CatregoryService } from "./../../services/catregory.service";
@Component({
  selector: "app-sub-categories",
  templateUrl: "./sub-categories.component.html",
  styleUrls: ["./sub-categories.component.scss"]
})
export class SubCategoriesComponent implements OnInit {
  categories: Category[];
  constructor(
    private categoriesService: CatregoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(res => {
      this.categoriesService.categories.subscribe((categories: Category[]) => {
        if (categories) {
          const category = categories.find(obj => obj.id == res.id);
          console.log(category);
          this.categories = category.sub_categories;
        }
      });
    });
  }
}
