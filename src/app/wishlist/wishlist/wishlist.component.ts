import { Product } from "./../../models/product.model";
import { WishlistService } from "./../../services/wishlist.service";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: "app-wishlist",
  templateUrl: "./wishlist.component.html",
  styleUrls: ["./wishlist.component.scss"]
})
export class WishlistComponent implements OnInit {
  products: Product[];
  allItems: Product[];
  sortByOrder: any;
  destroyObs$ = new Subject();
  @Input() id: string;
  @Input() maxSize: number;
  @Output() pageChange: EventEmitter<number>;
  currentPageIndex = 0;
  itemsPerPage = 8;
  constructor(private wishlistService: WishlistService) {}

  ngOnInit() {
    this.wishlistService
      .getWishlist()
      .pipe(takeUntil(this.destroyObs$))
      .subscribe((res: Product[]) => {
        this.products = res;
        this.allItems = res;
      });
  }

  // Refresh product when product removed from wishlist successfully.
  refreshProduct(product: Product) {
    const prodouctToRemove = this.products.find(
      (item: Product) => item.id == product.id
    );
    if (prodouctToRemove) {
      const index = this.products.indexOf(prodouctToRemove);
      this.products.splice(index, 1);
    }
  }

  setAllAitemsArray(arr) {
    this.allItems = arr;
    this.products = arr;
  }
  // sorting type ASC / DESC / A-Z / Z-A etc.
  public onChangeSorting(val) {
    let clonedItems = [...this.allItems];
    this.sortByOrder = val;
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
