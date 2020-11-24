import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { WishlistRoutingModule } from "./wishlist-routing.module";
import { WishlistComponent } from "./wishlist/wishlist.component";
import { SharedModule } from "../shared/shared.module";
import { NgxPaginationModule } from "ngx-pagination";

@NgModule({
  declarations: [WishlistComponent],
  imports: [
    CommonModule,
    WishlistRoutingModule,
    SharedModule,
    NgxPaginationModule
  ]
})
export class WishlistModule {}
