import { NgxUiLoaderModule } from "ngx-ui-loader";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MyOrdersRoutingModule } from "./my-orders-routing.module";
import { OrdersService } from "../services/orders.service";
import { OrderDetailsComponent } from "./order-details/order-details.component";
import { MyOrdersComponent } from "./my-orders/my-orders.component";
import { MatProgressSpinnerModule } from '@angular/material';

@NgModule({
  imports: [CommonModule, MyOrdersRoutingModule, NgxUiLoaderModule, MatProgressSpinnerModule],
  providers: [OrdersService],
  declarations: [OrderDetailsComponent, MyOrdersComponent]
})
export class MyOrdersModule {}
