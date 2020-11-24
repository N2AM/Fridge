import { Component, OnInit } from '@angular/core';
import { UserService } from './../../services/user.service';
import { Address } from './../../models/address.model';
import { AppStore } from './../../store/app.store';
import { District } from '../../models/district.model';
import { FormGroup, FormBuilder, Validators, NgModel } from '@angular/forms';
import { OrdersService } from './../../services/orders.service';
import { Cart } from './../../models/cart.model';
import { User } from './../../models/user.model';
import { Observable } from 'rxjs';
import { DialogService } from './../../services/dialog.service';
import { take } from 'rxjs/operators';


interface CheckoutQuery {
  address_id?       : string | number;
  date?             : string;
  discount?         : string | number;
  payment_method?   : string;
  time_section_id?  : number | string;
  promocode?        : string;
}

interface CheckoutState {
  loading?  : boolean;
  fail?     : boolean;
  success?  : boolean;
  data?     : any;
  error?    : any;
}

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: [
    './delivery.component.css',
    './delivery.component.scss'
]
})
export class DeliveryComponent implements OnInit {
  // flags
  noItemsInCart = false;
  checkoutStage = true;
  paymentMethodStage = false;
  confirmStage = false;
  
  // date picker min date
  dateNow = new Date();
  minDate = Date.now();
  // date picker min date

  address: Address;
  addresses: Address[] = [];
  deliveryTimeForm : FormGroup;
  timeSections: any[];

  cart: Cart;

  // Payment Methods Properties
  cash: boolean = false;
  credit: boolean = false;

  creditForm: FormGroup;
  promoCode:any =  {
    value: '',
    loading: false,
    loaded: false,
    error: '',
    success: false
  };

  checkoutQuery: CheckoutQuery = {
    payment_method: 'Cash'
  };

  checkoutState: CheckoutState = {
    loading: false,
    success: false,
    fail: false,
    error: false
  };

  submitted: boolean = false;

  // User Info
  userInfo: User;
  deliveryAddress: Address;

  constructor(
    private userService: UserService,
    private ordersService: OrdersService,
    private store: AppStore,
    private fb: FormBuilder,
    private dialogService: DialogService
  ) { }

  ngOnInit() {

    // if cart is empty, show [continue shopping button].
    this.store.cart$.subscribe((cart: Cart)=>{
      if(cart.products.length < 1) {
        this.noItemsInCart = true;
      } else {
        this.noItemsInCart = false;
      }
      this.cart = {...cart};
    });

    // Build Forms
    this.buildCreditForm();
    this.buildDeliveryTimeForm();

    // Get addresses
    this.userService.getUserAddresses().subscribe((addresses: Address[])=>{
      // let districts = this.store.districts;
      //   districts.forEach((district: District, i) =>{
      //     addresses.map((address, i)=>{
      //       if(district.id == address['district_id'])
      //       address['district_name'] = district['name'];

      //       return address;
      //     })
      //   });
      this.store.addresses$.next([...addresses]);
    });

    this.store.addresses$.subscribe((addresses)=>{
      this.addresses = addresses;
      console.log('addresses form store is ::', addresses)

    });

    this.store.addedAddress$
    // .pipe(take(2))
    .subscribe((address: Address)=>{
      // console.log('added address subscrition ::', address);
      if(address.address_id) {
        // console.log('before adding address to dropdown', address)
        this.addresses.push(address);
        this.deliveryTimeForm.controls['address_id'].setValue(address.address_id);
        this.addressSelected({target: {value : address.address_id}});
      }
    });

    


    // Get User info
    this.userService.getUserProfile().subscribe((userInfo: User)=>this.userInfo = userInfo);

  }

  buildDeliveryTimeForm () {
    // initialize delivery time formm
    this.deliveryTimeForm = this.fb.group({
      'delivery_date': [{value: '', disabled: true}, [
        Validators.required
      ]],
      'address_id': ['', [
        Validators.required
      ]],
      'time_section_id': [{value: '', disabled: true}, [
        Validators.required
      ]]
    });
  }

  buildCreditForm() {
    // Payment method 
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
    // END:: payment method
  }

  //  trackByRef = (index: number, item: any) => item;
  addressSelected(e) {
    let addressId = e.target.value;

    this.deliveryTimeForm.get('delivery_date').enable();
    // console.log(addressId);
    this.store.selectedAddressID$.next(addressId)
  }

  formatDateDDMMYY(date: any) {
    let d: any = new Date(date);
    return (d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear()).toString();
  }

  openAddAddressDialog(){
    console.log('open dialog fired.')
    this.dialogService.openAddAddressDialog({
      title: `Add New Address`
    })
  }

  loadDeliveryTime(e: Event) {
    if(this.deliveryTimeForm.value['address_id']){
      const date = (e.target as HTMLInputElement).value;
      let d: any = this.formatDateDDMMYY(date);

      // set delivery date Property Value with formatted date.
      this.deliveryTimeForm.value['delivery_date'] = d;

      this.ordersService.getTimeSections(this.deliveryTimeForm.value['address_id'], d)
        .subscribe((res: any) =>{
          // console.log('time sections:: ', res);
          this.timeSections = res;

          // enable time dropdown
          this.deliveryTimeForm.get('time_section_id').enable();
        });
    }
  }

  submitDelviryTimeForm() {
    // fire submitted flag.
    this.submitted = true;
    console.log(this.deliveryTimeForm.value['address_id'])

    console.log('delivery form is invalid:: ', this.deliveryTimeForm.invalid)
    if(this.deliveryTimeForm.invalid) {
      for(let prop in this.deliveryTimeForm.controls) {
        this.deliveryTimeForm.controls[prop].markAsTouched();
      }
      return false; // to check if form valid or not in a seprate function
    }
    let query = {
      "time_section_id": this.deliveryTimeForm.value['time_section_id'],
      "date": this.formatDateDDMMYY(this.deliveryTimeForm.get('delivery_date').value),
      "address_id": this.deliveryTimeForm.value['address_id'],
    }

    this.checkoutQuery = {
      ...this.checkoutQuery,
      ...query
    }
    this.deliveryAddress = this.addresses.find((address: Address)=> address.address_id == query.address_id)
    console.log('query state ::', this.checkoutQuery);
    return true; // for if check in the seprate function.
  }

  // getter for credit form controls
  get creditF() {return this.creditForm.controls }

  // listener for change on radio buttons of payment method
  paymentMethodChange(e: Event) {
    let el = (e.target as HTMLInputElement);
    if(el.id == '--cash') {
      this.cash = true;
      this.credit = false;
      this.checkoutQuery.payment_method = 'Cash';
    } else if (el.id == '--credit-card') {
      this.credit = true;
      this.cash = false;
      this.checkoutQuery.payment_method = 'Credit';

    }
  }


  checkout() {
    let paymentMethod = 'cash';
    // if(this.cash) paymentMethod = 'Cash';
    if(this.credit) paymentMethod = 'Credit';
  }

  checkPromoCodeValidity(promo: any) {
    if(!promo.value) {
      this.promoCode.success = false;
      return this.promoCode.error = 'You must enter a promo code.'
    }
    this.promoCode.loading = true;
    this.ordersService.validatePromoCode(promo.value)
      .subscribe((res: any)=>{
        console.log(res);
        if(res) {
          this.promoCode = {
            ...this.promoCode,
            loading: false,
            loaded: true,
            error: '',
            success: res,
          }
          this.checkoutQuery = {
            ...this.checkoutQuery,
            discount: +res.discount_rate,
            promocode: this.promoCode.value
          }
        }
      },
      err => {
        // console.log('err from promo ', err)
        this.promoCode.loading = false;
        // this.promoCode.error = err;
        this.promoCode.success = false;

        this.checkoutQuery = {
          ...this.checkoutQuery,
          discount: '',
          promocode: ''
        }
      })
  }



  checkoutSteper() {
    // if(!(this.checkoutStage || this.deliveryTimeForm.valid) 
    //   || 
    //   !(this.paymentMethodStage && this.checkoutQuery['payment_method'])) {
    //     this.checkoutFormError = 'You have fill required field to proceed.'
    // }

    if(this.checkoutStage) {
      if(this.submitDelviryTimeForm()) {
        this.checkoutStage = false;
        this.paymentMethodStage = true;

      }
    }
    else if (
      this.paymentMethodStage && this.checkoutQuery['payment_method']
      ) {
      if(!this.promoCode.value) this.checkoutQuery.discount = '';
      console.log('query:: ', this.checkoutQuery);


      this.checkoutState.loading = true;
      this.ordersService.checkout(this.checkoutQuery)
      .subscribe((res: any)=>{
        console.log('checkout resposne ::', res);
        this.checkoutState.loading = false;
      
      if(res){
          this.checkoutState.success = true;
          this.checkoutState.data = res;

          // reset local cart array.
          this.store.cart = [];

          this.paymentMethodStage = false;
          this.confirmStage = true;
        }
      }, err => {
        this.checkoutState.loading = false;
        this.checkoutState.fail = true;
        if(err)
        this.checkoutState.error = err;
        // console.log('checkout api error ::', err)
      })
    }

  }

}
