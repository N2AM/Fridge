import { DialogService } from './dialog.service';
import { Cart } from './../models/cart.model';
import { ProductService } from './product.service';
import { AppStore } from '../store/app.store';
import { Product } from './../models/product.model';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductHelper } from '../helpers/product.helpers';

@Injectable({
  providedIn: "root"
})
export class CartService {
  counter: number = 0;
  constructor(
    private http: HttpClient,
    private store: AppStore,
    private productHelper: ProductHelper,
    private dialogService: DialogService
  ) {}

  addAndDeleteToFromCart(productId?, qty?, query: boolean | any[] = false) {
    /* productId and qty are optinal if they exist, so i will delete or add one product, else
      if its valuse falsey i expect array of objects to add or remove.
    */
    !query ? query = [{ id: productId, qty }] : query;
    return this.http.post(environment.apiUrl + "/cart", query);
  }

  getCart() {
    return this.http.get<Product[]>(environment.apiUrl + "/cart");
  }

  deleteDifferFromCart(item: Product) {
    item.qty = 1;
    return this.decreaseProductQty(item);
  }

  decreaseProductQty(product: Product) {
   if(this.productHelper.checkRemoveClickCounter(product)) {
     // if product doesn't exist in cart, show dialog and return.
     let productInCart: Product = this.store.cartValue.products.find(
      (item: Product) => item.id == product.id
    );

    if (!productInCart)
      this.dialogService.openDialog({
        msg: "Sorry this item dosn't exist in the cart.",
        justOk: true
      });

    this.counter = product.qty;
    this.counter--;
    // console.log('counter', this.counter, product.qty)
    this.addAndDeleteToFromCart(product["id"], this.counter).subscribe(
      (products: Product[]) => {
        this.store.cart = products;

        // idecrease product quantity for [View].
        product.qty--;

        // reset click counter when API Calling success.
        product.removeClickCounter = 0;
      },
      err => {
        // reset counter
        this.counter = product.qty;

      // reset click counter when API Calling fail.
      product.removeClickCounter = 0;

      // dialog with error
      this.dialogService.openDialog({
        msg: JSON.stringify(err.error),
        justOk: true
      })
    });
   } else return;
  }

  increaseProductQty(product: Product) {
    /* if product quantity in stock < increamentment of user, open dialog
        reset click counter = 0 to show modal if clicked again and return.
    */

      /* Counter propery will take product quantit value and pass it to checkProductInStock
        instead of qty prop to prevent updating qty prop if api failed.
      */
      if(this.productHelper.checkAddClickCounter(product)){
        this.counter = product.qty;
        this.counter++;
        if (this.productHelper.checkProductInStock(product, this.counter) === false)
          return;

        this.addAndDeleteToFromCart(product["id"], this.counter).subscribe(
          (products: Product[]) => {
            this.store.cart = products;

            // increase product quantity for [View].
            product.qty++;

            // reset click counter when API Calling success.
            product.addClickCounter = 0;
          },
          err => {
            // if api call failed, the product qty is still the current value, assign counter to this value.
            this.counter = product.qty;

            // reset click counter when API Calling fail.
            product.addClickCounter = 0;

            // dialog with error
            this.dialogService.openDialog({
              msg: JSON.stringify(err.error),
              justOk: true
            })
        });
      } else return;
  }
}
