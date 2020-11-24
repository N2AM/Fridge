import { Product } from "./../../models/product.model";
import { Utilities } from "./../../helpers/utilities";
import { CatregoryService } from "./../../services/catregory.service";
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { switchMap, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { Brand } from "../../models/brand.model";
import { Category } from "../../models/category.model";
import { FormGroup, FormControl } from "@angular/forms";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
// import { NgxUiLoaderService } from "ngx-ui-loader";
import * as _ from "lodash";

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.scss"]
})
export class CategoryComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() id: string;
  @Input() maxSize: number;
  @Output() pageChange: EventEmitter<number>;
  currentPageIndex = 0;
  itemsPerPage = 8;
  products: Product[];
  show = 5;

  categoryId: number;
  orignialProductsList: Product[];
  productState = {
    loading: false,
    loaded: false,
    fail: false
  }
  noProducts = true;
  brands: any[];
  destroy$ = new Subject();
  checkedList = [];
  category: Category;
  priceForm = new FormGroup({
    min: new FormControl(""),
    max: new FormControl("")
  });

  constructor(
    private categoriesService: CatregoryService,
    public utils: Utilities,
    public router: Router,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    $(".menu-overlay").click(function() {
      $(".pt-5").hide();
      $(".menu-overlay").hide();
    });
    this.breakpointObserver
      .observe(["(min-width: 992px)"])
      .subscribe(result => {
        if (result.matches) {
          $(".pt-5").show();
          $(".pt-5").css("width", "100%");
        } else {
          $(".pt-5").hide();
          $(".menu-overlay").hide();
        }
      });
    // this.categoriesService
    //   .getBrands()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((brands: Brand[]) => {
    //     this.brands = brands;
    //     // console.log(brands);
    //   });

    this.categoryId = this.route.snapshot.params["id"];
    // console.log(this.categoryId);
    this.categoriesService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((categories: Category[]) => {
        // console.log(categories);
        this.category = categories.find(obj => obj.id == this.categoryId);
        console.log('category is', this.category);
      });

    // Get products
    this.productState.loading = true;
    this.route.params
      .pipe(
        switchMap(params => {
          this.categoryId = params["id"];
          return this.categoriesService.getAllCategoryProducts(this.categoryId);
        })
      )
      .subscribe((res: Product[]) => {
        this.productState.loading = false;
        this.productState.loaded = true;

        this.orignialProductsList = res;
        this.products = res;
        let result = this.products.map(a => {
          return { name: a.brand, id: a.brand_id };
        });
        let uniq = _.uniqBy(result, "id");
        this.brands = uniq;
        if (this.products.length == 0) {
          this.noProducts = false;
        }
      }, err => {
        this.productState.loading = false;
        this.productState.fail = true;

      });
  }
  ngAfterViewInit() {}
  ngOnDestroy() {
    this.destroy$.next(false);
    this.destroy$.complete();
  }
  getCatProducts(event, name: string, i) {
    // console.log(i);
    // console.log(this.checkedList);
    if (event.target.checked) {
      this.checkedList.push({
        id: i,
        name: name,
        status: event.target.checked
      });
      // console.log(event.target.checked);
      this.products = this.orignialProductsList.filter(product =>
        this.checkedList.find(
          cbox => cbox.name === product.brand && cbox.status === true
        )
      );
      // console.log(this.products);
    } else {
      if (this.checkedList.find(obj => obj.name == name)) {
        this.checkedList = this.checkedList.filter(obj => obj.name !== name);
        // console.log(this.checkedList);
        this.products = this.orignialProductsList.filter(product =>
          this.checkedList.find(
            cbox => cbox.name === product.brand && cbox.status === true
          )
        );
        if (this.checkedList.length <= 0) {
          this.products = this.orignialProductsList;
        }
      }
      // console.log(this.products);
    }
  }
  filterByPrice(event) {
    if (this.priceForm.value.min !== "" && this.priceForm.value.max !== "") {
      if (this.checkedList) {
        this.products = this.products.filter(product => {
          return (
            product.standard_rate >= this.priceForm.value.min &&
            product.standard_rate <= this.priceForm.value.max
          );
        });
      } else {
        this.products = this.orignialProductsList.filter(product => {
          return (
            product.standard_rate >= this.priceForm.value.min &&
            product.standard_rate <= this.priceForm.value.max
          );
        });
      }
    } else {
      this.products = this.orignialProductsList;
    }
  }
  clear(event) {
    this.priceForm.controls["min"].setValue("");
    this.priceForm.controls["max"].setValue("");
  }

  setAllAitemsArray(arr) {
    this.products = arr;
  }
  public onChangeSorting(val) {
    let clonedItems = [...this.orignialProductsList];
    if (val == "asc") {
      let itemsSortedByID = clonedItems.sort((a, b) => {
        if (a.id < b.id) return -1;
        else if (a.id > b.id) return 1;
        return 0;
      });
      this.setAllAitemsArray(itemsSortedByID);
      console.log("original sorted by id from 0 - 100..", itemsSortedByID);
      // this.allItems = this.allItems;
    }

    if (val == "low-to-high") {
      let itemsSortedByPriceLowToHigh = clonedItems.sort((a, b) => {
        if (a.standard_rate < b.standard_rate) return -1;
        else if (a.standard_rate > b.standard_rate) return 1;
        return 0;
      });
      this.setAllAitemsArray(itemsSortedByPriceLowToHigh);
      console.log(
        "original sorted by id from 0 - 100..",
        itemsSortedByPriceLowToHigh
      );
    }

    if (val == "high-to-low") {
      let itemsSortedByPriceHighToLow = clonedItems.sort((a, b) => {
        if (a.standard_rate > b.standard_rate) return -1;
        else if (a.standard_rate < b.standard_rate) return 1;
        return 0;
      });
      this.setAllAitemsArray(itemsSortedByPriceHighToLow);
      console.log(
        "original sorted by id from 0 - 100..",
        itemsSortedByPriceHighToLow
      );
    }

    if (val == "A-Z") {
      let itemsSortedByATOZ = clonedItems.sort((a, b) => {
        if (a.name > b.name) return 1;
        else if (a.name < b.name) return -1;
        return 0;
      });
      this.setAllAitemsArray(itemsSortedByATOZ);
    }

    if (val == "Z-A") {
      let itemsSortedByATOZ = clonedItems.sort((a, b) => {
        if (a.name > b.name) return -1;
        else if (a.name < b.name) return 1;
        return 0;
      });
      this.setAllAitemsArray(itemsSortedByATOZ);
    }
  }
  openside() {
    $(".pt-5").show();
    $(".pt-5").css("width", "50%");
    $(".menu-overlay").show();
  }
  closeside() {
    $(".pt-5").css("width", "0");
    $(".menu-overlay").hide();
  }
  goToPrevious(p: any) {
    p.previous();
    window.scroll(0, 0);
  }

  goToNext(p: any) {
    p.next();
    window.scroll(0, 0);
  }

  changeCurrentPage(p: any, page: any) {
    p.setCurrent(page.value);
    window.scroll(0, 0);
  }
}
