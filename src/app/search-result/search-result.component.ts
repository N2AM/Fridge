import { Product } from "./../models/product.model";
import { ProductService } from "./../services/product.service";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-search-result",
  templateUrl: "./search-result.component.html",
  styleUrls: ["./search-result.component.scss"]
})
export class SearchResultComponent implements OnInit {
  products: Product[];
  currentPageIndex = 0;
  itemsPerPage = 8;
  constructor(
    private productService: ProductService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activeRoute.url.subscribe(res => {
      this.productService
        .searchByName(res[1].path)
        .subscribe((res: Product[]) => {
          this.products = res;
          console.log(this.products);
        });
    });
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
