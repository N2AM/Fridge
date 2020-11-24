import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { OrdersService } from './../../services/orders.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: [
    './payment.component.css',
    './payment.component.scss'
  ]
})
export class PaymentComponent implements OnInit {
  cash: boolean = false;
  credit: boolean = false;

  creditForm: FormGroup;
  cashForm: FormGroup;
  promoCode = '';
  constructor(
    private fb: FormBuilder,
    private ordersService: OrdersService
  ) { }

  ngOnInit() {
    // const radioButtons = Array.from(document.querySelectorAll('input[name="paymentMethod"]'));
    // radioButtons.forEach((checkbox: HTMLInputElement)=>{
    //   checkbox.addEventListener('change', this.paymentMethodChange);
    // })

    // initilaize creditForm FORM
    this.creditForm = this.fb.group({
      'card-number': ['', [
        Validators.required,
      ]],
      'expiry-date': ['', [
        Validators.required,
      ]],
      'card-holder-name': ['', [
        Validators.required,
      ]],
      'security-code': ['', [
        Validators.required,
      ]]
    });

    this.cashForm = this.fb.group({
      'city': ['', [
        Validators.required,
      ]],
      'street-name': ['', [
      ]],
      'building-number': ['', [
        Validators.required,
      ]],
      'float-number': ['', [
        Validators.required,
      ]],
      'flat-number': ['', [
        Validators.required,
      ]],
      'nearest-landmark': ['', [
        Validators.required,
      ]]
    })
  }

  // getter for credit form controls
  get creditF() {return this.creditForm.controls }

  // getter  for cash form controls.
  get cashF() {return this.cashForm.controls }

  // listener for change on radio buttons of payment method
  paymentMethodChange(e: Event) {
    let el = (e.target as HTMLInputElement);
    if(el.id == '--cash') {
      this.cash = true;
      this.credit = false;
    } else if (el.id == '--credit-card') {
      this.credit = true;
      this.cash = false;
    }
  }


  checkout() {
    let query, paymentMethod = 'cash';

    if(this.cash) paymentMethod = 'cash';
    if(this.credit) paymentMethod = 'credit';

    query =   {
      "time_section_id": 0,
      "address_id": 0,
      "payment_method": paymentMethod,
      "promocode": this.promoCode
    }

    console.log(query);
    // this.orderService.checkout(query);
  }

}
