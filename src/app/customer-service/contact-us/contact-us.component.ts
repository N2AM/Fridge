import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { CustomerService } from "../../services/customerService.service";
import { DialogService } from "../../services/dialog.service";

@Component({
  selector: "app-contact-us",
  templateUrl: "./contact-us.component.html",
  styleUrls: ["./contact-us.component.css"]
})
export class ContactUsComponent implements OnInit {
  contactForm: FormGroup;
  prop = '';
  
  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private dialog: DialogService
  ) {}

  ngOnInit() {
    this.contactForm = this.fb.group({
      name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
          Validators.pattern("[a-zA-Z ]*")
        ]
      ],
      email: [
        "",
        [
          Validators.email,
          Validators.required,
          Validators.pattern(
            "[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}"
          )
        ]
      ],
      message: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(250)
        ]
      ]
    });
  }
  get conf() {
    return this.contactForm.controls;
  }
  contact() {
    this.prop = `<p> hi </p>`
    console.log(this.contactForm.value);
    if (this.contactForm.valid) {
      console.log("ss");
      this.customerService
        .postContact(this.contactForm.value)
        .subscribe((res: any) => {
          this.dialog.openDialog({ message: res.message, justOk: true });
          this.contactForm.reset();
        });
    }
  }
}
