import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CustomerServiceRoutingModule } from "./customer-service-routing.module";
import { FaqComponent } from "./faq/faq.component";
import { HelpComponent } from "./help/help.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [HelpComponent, FaqComponent, ContactUsComponent],
  imports: [
    CommonModule,
    CustomerServiceRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CustomerServiceModule {}
