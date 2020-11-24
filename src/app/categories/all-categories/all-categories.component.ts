import { ActivatedRoute, Router } from "@angular/router";
import { Category } from "./../../models/category.model";
import { CatregoryService } from "./../../services/catregory.service";
import { Component, OnInit } from "@angular/core";
import { takeUntil, withLatestFrom, first, take, map } from "rxjs/operators";
import { Observable } from "rxjs";

@Component({
  selector: "app-all-categories",
  templateUrl: "./all-categories.component.html",
  styleUrls: ["./all-categories.component.scss"]
})
export class AllCategoriesComponent implements OnInit {
  constructor(
    private categoriesService: CatregoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  categories$: Observable<Category[]>;
  ngOnInit() {
    this.categories$ = this.categoriesService.categories;
  }
}
