import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { UserProfileRoutingModule } from "./user-profile-routing.module";
import { MyAccountComponent } from "./my-account/my-account.component";

@NgModule({
  declarations: [MyAccountComponent],
  imports: [
    CommonModule,
    UserProfileRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class UserProfileModule {}
