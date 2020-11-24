import { Product } from "./../models/product.model";
import { Router } from "@angular/router";
import { LoginDialogComponent } from "./../shared/login-dialog/login-dialog.component";
import { Utilities } from "./../helpers/utilities";
import { environment } from "./../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { Overlay } from "@angular/cdk/overlay";
import { Order } from "../models/order.model";

@Injectable({
  providedIn: "root"
})
export class OrdersService {
  constructor(private http: HttpClient, private utilities: Utilities) {}

  checkout(query) {
    return this.http.post(environment.apiUrl + "/checkout", query);
  }

  getOrders() {
    return this.http.get<Order[]>(environment.apiUrl + "/delivery/user/orders");
  }

  getTimeSections(addressId: number, delivery_date: any) {
    return this.http.get(
      environment.apiUrl +
        `/time/sections?delivery_date=${delivery_date}&address_id=${addressId}`
    );
  }

  getShippingRate(addressId) {
    return this.http.get(environment.apiUrl + '/shipping?address_id=' + addressId);
  }

  validatePromoCode(promoCode: String) {
    return this.http.post(environment.apiUrl + "/promocode/validate", {
      code: promoCode
    });
  }
  getOrderDetails(id) {
    return this.http.get<Order>(environment.apiUrl + "/orders/" + id);
  }
}
