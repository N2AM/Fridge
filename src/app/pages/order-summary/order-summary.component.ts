import { ActivatedRoute } from '@angular/router';
import { AppStore } from './../../store/app.store';
import { Cart } from './../../models/cart.model';
import { Component, OnInit , Input } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent implements OnInit {
  @Input('cart') cart: Cart;
  @Input('checkoutPage') checkoutPage = false;

  shippingRate: any = {};
  constructor(
    public route: ActivatedRoute,
    private store: AppStore,
    private orderService: OrdersService
  ) { }

  ngOnInit() {
    // this.store.cart$.subscribe((cart: Cart)=>{
    //   this.cart = cart;
    // })
    // if(this.cart) {
    //   console.log('cart is :: ', this.cart)
    // }
    this.store.selectedAddressID$
    .pipe(
      switchMap((addressId)=>{
        return this.orderService.getShippingRate(addressId)
      })
    ).subscribe((shippingRate)=>{
      this.shippingRate = shippingRate;
      // console.log('shipping rate is :', shippingRate);
    })
  }

}
