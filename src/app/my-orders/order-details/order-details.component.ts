import { AppStore } from "./../../store/app.store";
import { Order } from "./../../models/order.model";
import { OrdersService } from "./../../services/orders.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-order-details",
  templateUrl: "./order-details.component.html",
  styleUrls: ["./order-details.component.scss"]
})
export class OrderDetailsComponent implements OnInit {
  order: Order;
  constructor(
    private route: ActivatedRoute,
    private ordersService: OrdersService,
    private sotre: AppStore,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(res => {
      this.ordersService.getOrderDetails(res.id).subscribe((order: Order) => {
        this.order = order;
      });
    });
  }
  reorder(order) {
    this.sotre.cart = order.cart;
    this.router.navigate(["/checkout"]);
  }
}
