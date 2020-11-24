import { Product } from './../models/product.model';
import { Cart } from './../models/cart.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppStore {
    constructor () {}

    // Cart Observable.
    cart$: BehaviorSubject<Cart> = new BehaviorSubject({products: [], itemsQty: 0});

    // cart$.next(), Add items on the cart.
    set cart(products: Product[]) { 

        // calc totalPrice for each product item, and cart totalPrice.
        let cartTotalPrice = 0;
        products.forEach((item: Product)=> {
            item.totalPrice = +(item['qty'] * item['standard_rate']).toFixed();
            cartTotalPrice += item.totalPrice;
        });
            // set cart var with its interface.
        let cart: Cart = {
            products, 
            itemsQty: products.length,
            totalPrice: cartTotalPrice
        }
            // emit a new cart object.
        this.cart$.next(cart); 
    }

    // Get cart$ value
    get cartValue (): Cart { return this.cart$.value}

    districts$ = new BehaviorSubject([]);

    set districts (value: any) {
        this.districts$.next(value);
    }
    get districts () {
        return this.districts$.value;
    }

    addresses$ = new BehaviorSubject([]);
    addedAddress$ = new BehaviorSubject({});
    selectedAddressID$ = new BehaviorSubject({});

    orderTotal = new BehaviorSubject(0);
}