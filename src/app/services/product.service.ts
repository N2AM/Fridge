import { Cart } from "./../models/cart.model";
import { CartService } from "./cart.service";
import { Product } from "./../models/product.model";
import { Router } from "@angular/router";
import { LoginDialogComponent } from "./../shared/login-dialog/login-dialog.component";
import { Utilities } from "./../helpers/utilities";
import { environment } from "./../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material";
import { takeUntil, map } from "rxjs/operators";
import { Subject } from "rxjs";
import { Overlay } from "@angular/cdk/overlay";
import { AppStore } from "../store/app.store";
import { ProductHelper } from "./../helpers/product.helpers";

@Injectable({
  providedIn: "root"
})
export class ProductService {
  destroyObs$ = new Subject();
  constructor(
    private http: HttpClient,
    private utilities: Utilities,
    public loginDialog: MatDialog,
    private router: Router,
    private overlay: Overlay,
    private store: AppStore,
    private cartService: CartService,
    private productHelper: ProductHelper
  ) {}

  isProduct(item: any): item is Product {
    return (!!item['description']) && (!!item['name']) && (!!item['item_group']);
  }

  isArrayOfProduct(array: any) {
    if(Array.isArray(array)) {
      let arr = array.map((item: any) => {
        if(this.isProduct(item)) return item;
      });

      arr.forEach((item)=>{
        if(!item) arr = [];
      });

      return arr;

    } else {
      return [];
    }
  }

  getProductById(productId) {
    return this.http.get<Product>(
      environment.apiUrl + "/product?id=" + productId
    );
  }

  getRelatedProductsOfProduct(productId) {
    return this.http.get<Product[]>(
      environment.apiUrl + "/related-products?id=" + productId
    ).pipe(
      map((res: any) => {
        return this.isArrayOfProduct(res);
      })
    );
  }

  getProductsByBrand(productId) {
    return this.http.get<Product[]>(
      environment.apiUrl + "/brands/products?id=" + productId
    ).pipe(
      map((res: any) => this.isArrayOfProduct(res))
    );
  }

  addToWishlist(product) {
    if(this.utilities.userIsNotLoggedInWithDialog({
      msg: "You have to login first.",
      loginButtons: true
    })) return false;

    if (!product.clickCounter) {
      product.clickCounter = 1;
    } else {
      product.clickCounter++;
    }
    if (product.clickCounter == 1) {
      let query = {
        product_id: product.id,
        name: product.name
      };
      this.http.post(environment.apiUrl + "/user/favorites", query).subscribe(
        (res: any) => {
          if (res["Status"] == "Success") {
            product.favourite = true;
            product.clickCounter = 0;
          }
        },
        err => {
          product.favourite = false;
          product.clickCounter = 0;
        }
      );
    }
  }

  async removeFromWishlist(product) {
    if(this.utilities.userIsNotLoggedInWithDialog({
      msg: "You have to login first.",
      loginButtons: true
    })) {
      console.log('user is not logged in ');
      return false
    };

    let productId = product.id;
    // IF there's internet connection
    if (navigator.onLine) {
      if (!product.clickCounterToRemove) {
        product.clickCounterToRemove = 1;
      } else {
        product.clickCounterToRemove++;
      }
      /* if user clicked alot of time, will request API only the first one.
       */
      if (product.clickCounterToRemove == 1) {
        console.log(product.clickCounterToRemove);
        return this.http
          .delete(environment.apiUrl + "/user/favorites?product_id=" + productId).toPromise()
          .then(
            res => {
              /* If there's response and product has beend removed successfully,
            change favourite prop to flase, and reset clickCounterToRemove = 0,
            then Proimse will return true.
          */
              if (res) {
                product.favourite = false;
                product.clickCounterToRemove = 0;
                return true;
              } else {
                product.clickCounterToRemove = 0;
                console.log('else res', res)
                // if there's no response, Promise returns false.
                return false;
              }
            },
            // On Proimse Rejection, Promise returns false.
            err => {
              // if there's error at this moment reset click counter
              product.clickCounterToRemove = 0;
              console.log('on err', err)
              return false;
            }
          )
          .then(res => res)
          .catch(err => {
            // if there's an error from api at this moment reset click Counter.
            product.clickCounterToRemove = 0;
            console.log('on err catch Promise', err)
            return false;
          });
      } else {
        /* if counter > 1, user clicked so much, so return false and don't do any thing.
         */
        return false;
      }
      // if there's no internet connection, return false for ProductItem EventEmitter.
    } else {
      return false;
    }
  }

  addToCart(product: Product, qty: number) {
    // if user hasn't logged in ask him to login.
    if(this.utilities.userIsNotLoggedInWithDialog({
      msg: "You have to login first.",
      loginButtons: true
    })) return false;

    /* if product quantity user added > product stock qty, show him a friendly msg
    and return.
    */
    if (this.productHelper.checkProductInStock(product, qty) == false) return;

    // if conditions passed, call API to add product to cart.
    this.cartService.addAndDeleteToFromCart(product["id"], qty).subscribe(
      (productsAPI: Product[]) => {
        // API returns all cart item after each addCart request.
        console.log('"POST" /cart', productsAPI);
        // store cart items Array to cart Observable Store.
        this.store.cart = productsAPI;

        // Update product qty prop
        product.qty++;

        this.calculateOrderTotal();
        // this.toastrService.success('This product has been added to cart.');
      },
      error => {
        // if server error, show user this error.
        this.loginDialog.open(LoginDialogComponent, {
          data: {
            msg: JSON.stringify(error.error), // stringify error object.
            loginButtons: false
          },
          closeOnNavigation: true,
          scrollStrategy: this.overlay.scrollStrategies.noop()
        });
      }
    );
  }
  calculateOrderTotal() {
    //   let total = 0;
    //   this.store.cart$.subscribe(cart => {
    //       if (cart && cart.length > 0) {
    //           for (const product of cart) {
    //               total += product.standard_rate * product.qty;
    //           }
    //       }
    //   });
    //   this.store.orderTotal.next(total);
  }

  autoCompleteSearch() {
    return this.http.get<Product[]>(
      environment.apiUrl + "/search/products/all"
    );
  }
  searchByName(name) {
    return this.http.get(environment.apiUrl + "/search/products?name=" + name);
  }
}
