import { Order } from "./../../models/order.model";
import { OrdersService } from "./../../services/orders.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-my-orders",
  templateUrl: "./my-orders.component.html",
  styleUrls: ["./my-orders.component.scss"]
})
export class MyOrdersComponent implements OnInit, OnDestroy {
  orders: Order[];
  destroy$ = new Subject();
  noOrders: boolean;
  constructor(private ordersService: OrdersService) {}

  ngOnInit() {
    this.ordersService
      .getOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe((orders: Order[]) => {
        this.orders = orders;
        console.log(this.orders);
        if (this.orders.length == 0) {
          console.log(this.orders);
          this.noOrders = true;
        }
      });
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
