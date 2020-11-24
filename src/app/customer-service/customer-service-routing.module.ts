import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HelpComponent } from "./help/help.component";
import { FaqComponent } from "./faq/faq.component";
import { ContactUsComponent } from './contact-us/contact-us.component';

const routes: Routes = [
  { path: "help", component: HelpComponent },
  { path: "FAQ", component: FaqComponent },
  { path:"contact-us", component: ContactUsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerServiceRoutingModule {}
