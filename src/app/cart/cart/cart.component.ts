import { ProductHelper } from './../../helpers/product.helpers';
import { FormControl, Validators } from '@angular/forms';
import { CartService } from './../../services/cart.service';
import { Product } from './../../models/product.model';
import { AppStore } from './../../store/app.store';
import { Cart } from './../../models/cart.model';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DialogService } from './../../services/dialog.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css', './cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: Cart;
  removeForm: FormGroup;
  formIsValid: boolean;

  removeOperationState: {
    loading?: boolean;
    fail?: boolean;
    error?: any;
    success?: boolean;
    res?: any;
  } = {};

  @ViewChild('checkAllBtn') checkAllBtn: ElementRef;

  constructor(
    private store: AppStore,
    private cartService: CartService,
    private fb: FormBuilder,
    private productHelper: ProductHelper,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.store.cart$.subscribe((cart: Cart)=>{
      this.cart = cart;
      console.log('from cart component cart is ::', this.cart)
      // initialize remove FORM
      this.removeForm = this.createFormControls(this.cart['products'])
    });
  }

  trackByProdId(item, i) {
    return item ? item.id : undefined;
  }

  // Create Form Group of ::[FormControl]
    // Helper function
  createFormControls(items: Product[]): FormGroup {
    let arr: FormGroup = new FormGroup({});
      items.forEach((product: Product) => {
        arr.setControl(product['id'].toString(), new FormControl('', [Validators.required]));
      });
    return arr;
  }

  decreaseProductQty(product: Product) {
      this.cartService.decreaseProductQty(product);
  }

  increaseProductQty(product: Product) {
    this.cartService.increaseProductQty(product);
  }

  checkAllItems(e: any) {
    console.log('target is ::', e.target.checked)
    if(e.target.checked) {
      for(let prop in this.removeForm.controls) {
        this.removeForm.controls[prop].setValue(true);
      }
    } else {
      for(let prop in this.removeForm.controls) {
        this.removeForm.controls[prop].setValue(false);
      }
    }
    
  }


  confirmDeletation() {
    //  reset formIsValid flag for each click event.
     this.formIsValid = false;

     for(let prop in this.removeForm.value) {
       if(this.removeForm.value[prop]){
         this.formIsValid = true;
       }
     };
     if(!this.formIsValid) {
      this.dialogService.openDialog({
        msg: 'Select item to delete first.',
        justOk: true
      });
      return;
     }
    this.dialogService.openDialog({
      msg: 'are you sure remove this product?',
      confirmButtons: true
    }).afterClosed().subscribe((res)=>{
      if(res) {
        this.removeItemsFromCart();

        if(!this.formIsValid) { // if user didn't select any one of items
          this.removeOperationState.fail = true;
          this.removeOperationState.error = 'you have to select on item at least to remove.'
        } else {
          this.removeOperationState.fail = false;
          this.removeOperationState.error = ''
        }
      }
    });
  }
  removeItemsFromCart() {
    let query: any[] = [];

    // reset formIsValid flag for each click event.
    // this.formIsValid = false;

    for(let prop in this.removeForm.value) {
      if(this.removeForm.value[prop]){
        query.push({qty: 0, id: prop});
        // this.formIsValid = true;
      }
    };

    // if there's checkbox is checked, call api.
    console.log('is form valid?::', this.formIsValid)
    if(this.formIsValid)
    this.cartService.addAndDeleteToFromCart(false, false, query)
    .subscribe((products: Product[])=>{
      // Update Cart array in App Store.
      this.store.cart = products;

      // If items removed successfully, reset removeAll checkbox
      this.checkAllBtn.nativeElement.checked = false;
    })
  }

  noItemsInCartDialog() {
    this.dialogService.openDialog({
      msg: "There's no items in cart, please add some.",
      justOk: true
    })
  }

}
