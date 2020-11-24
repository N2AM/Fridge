import { Faq } from "./../../models/faq";
import { CustomerService } from "./../../services/customerService.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-faq",
  templateUrl: "./faq.component.html",
  styleUrls: ["./faq.component.scss"]
})
export class FaqComponent implements OnInit {
  faqs: Faq[];
  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    this.customerService.getFAQ().subscribe((res: Faq[]) => {
      this.faqs = res;
    });
  }
}
