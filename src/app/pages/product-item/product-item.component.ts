import { Product } from './../../models/product.model';
import { Utilities } from './../../helpers/utilities';
import { ProductService } from './../../services/product.service';
import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: [
    './product-item.component.css',
    './product-item.component.scss'
    ]
})
export class ProductItemComponent implements OnInit {
  @Input() Status: any;
  @Input() product: Product;

  /* if user in product details page, and clicked on one of similar product or
    same barnd product, Scroll to top to show him the new selected product
  */
  @Output() linkClicked = new EventEmitter();


  /* if user in wishlist Page and remove a product from wishlist, emit an event to update
    wishlist Page products array.
   */
  @Output() removedFromWishlust = new EventEmitter();

  // Product Image, till image loaded.
  productImage = 'assets/img/no-product.jpg';

  quantity: number = 0;

  removeDiffer: boolean = false;
  constructor(
    public productService: ProductService,
    public utils: Utilities,
    private cartService: CartService
  ) { }
  ngOnInit() {
    if(this.product.images && (this.product.images.length > 0)) {
      this.productImage = this.product.images[0]
    } else {
      this.productImage = 'assets/img/no-product.jpg';
    }
    // this.product.images.length > 0 || ! ? 
    // this.productImage = this.product.images[0] : ;

    if(this.product.id === 189 && !this.product.qty){
      console.log('product here 189:: ', this.product)
    }
  }

  async removeFromWishlist(product) {
    /* Returned value from removeFromWishlist is a flag to know that product has been
    removed succesffully.
    This flag is return form a Promise.
    */
    const isRemoved = await this.productService.removeFromWishlist(product);
    console.log(isRemoved)
    // if product has been removed from wishlist successfully, product-item.component
    // emits an event.
    if(isRemoved) this.removedFromWishlust.emit(product)
  }

  // Add to cart
  addToCart(product: Product) {
    if(!product.qty) {
      this.quantity = 1;
    } else {
      this.quantity = product.qty;
      this.quantity++;
    }
    this.removeDiffer = false;
    this.productService.addToCart(product, this.quantity);
  }

  increaseProductQty(product: Product) {
    this.cartService.increaseProductQty(product);
  }

  decreaseProductQty(product: Product) {
    this.cartService.decreaseProductQty(product);
  }

  removeFromCart(product) {
    this.removeDiffer = true;
    this.cartService.deleteDifferFromCart(product)
  }
}
