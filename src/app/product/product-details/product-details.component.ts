import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Utilities } from './../../helpers/utilities';
import { Observable, Subject, of } from 'rxjs';
import { Product } from './../../models/product.model';
import { ProductService } from './../../services/product.service';
import {Component, OnInit, OnDestroy, AfterViewChecked} from '@angular/core';
import { switchMap, takeUntil, tap, catchError } from 'rxjs/operators';
import { CartService } from './../../services/cart.service';
declare var $: any;
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: [
    './product-details.component.css',
    'product-details.component.scss'
  ]
})
export class ProductDetailsComponent implements OnInit, OnDestroy, AfterViewChecked{
  destroyObs$ = new Subject();

  SimilarPro = 'SimilarProducts';
  SimilarBrands = 'SimilarBrands';
  selectedImage: string;

  productId: number | string;
  product: Product;
  similarProducts : Product[];
  sameBrand: Product[];
  carouselOptions;

  error: object |string ;
  constructor(
    private route: ActivatedRoute,
    public productService: ProductService,
    public utils: Utilities,
    public router: Router,
    private fb: FormBuilder,
    public cartService: CartService
  ) { }

  ngOnInit() {
    // Build forms
    this.buildReviewForm();

    // Build carousel Options
    this.buildCarouselOptions();

    // Get similar Products
    this.route.params
    .pipe(
      takeUntil(this.destroyObs$),
      switchMap((params)=>this.productService.getRelatedProductsOfProduct(params['id']))
      ).subscribe((products: Product[])=>{
        this.similarProducts = products;
        // console.log('similar ::', products.length);
      });

    // Get Product
    this.route.params.pipe(
      takeUntil(this.destroyObs$),
      switchMap(params=> this.productService.getProductById(params['id']))
    ).subscribe((product: Product)=>{
        this.product = product;
        if(this.product && this.product.images && this.product.images.length > 0){
          this.currentImage = this.product.images[0]; 
          // this.product.images = [...this.product.images,
          //   'http://163.172.104.238/RetailakFridge/public/imgs/products/91014311.png',
          //   'http://163.172.104.238/RetailakFridge/public/imgs/products/91014311.png',
          //   'http://163.172.104.238/RetailakFridge/public/imgs/products/91014311.png',
          //   'http://163.172.104.238/RetailakFridge/public/imgs/products/91014311.png',
          //   'http://163.172.104.238/RetailakFridge/public/imgs/products/91014311.png'
          // ]
          // $('.xzoom, .xzoom-gallery').xzoom({tint: '#333', Xoffset: 15});
          console.log(this.product)
        }
        else 
          this.currentImage = '../../assets/img/no-product.jpg';

        // Get same brand Products.
        if(this.product && this.product.brand_id) {
          this.productService.getProductsByBrand(this.product.brand_id)
          .pipe(takeUntil(this.destroyObs$),)
          .subscribe((products: Product[])=>{
              this.sameBrand = products;
              console.log('same Brandd ::', products);
            });
        }
      },
      err => this.error = err.error.message);
    
   

    
   
    
    // ZOOM PLUGIN :: HOSSAM implementation
    // $.getScript('/assets/js/XZoom.js');
    // $.getScript('/assets/js/XZoom.css');
    // $.getScript('/assets/js/ZoomSlider.js');
  }

  buildReviewForm () {
    // START:: ================ >> Review Form Initialization <<< =================
    this.reviewForm = this.fb.group({
      'reviewTitle': ['', [
        Validators.required, 
        Validators.minLength(5),
        Validators.maxLength(80)
      ]],
      'reviewRating': ['', [
        Validators.required, 
      ]],
      'reviewUserName': ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(30)
      ]],
      'reviewDesc': ['', [
        Validators.required, 
        Validators.maxLength(300)
      ]]
    })
    // END:: ================ >> Review Form Initialization <<< =================
  }

  buildCarouselOptions () {
     // Carousel Options 
     this.carouselOptions ={
      responsive: {
        // xs screen
        0: {
          items: 1,
          stagePadding: 25,
          nav: false
        },
        // medium screen
        425: {
          items: 1,
          stagePadding: 25,
          nav: false
        },
        // large screen
        1024: {
          items: 3,
          stagePadding: 70,
          nav: false,
          slideBy: 1,
          mouseDrag: false
        },
        // xl screen
        1248: {
          items: 3,
          nav: true,
          slideBy: 1,
          margin: 80,
          smartSpeed: 1000,
          mouseDrag: false
        }
      },
      navText: [
        '<div class="--prev-indicator"></div>',
        '<div class="--next-indicator"></div>',
      ],
      dots: false,
      // navContainer: '#--buttons-container'

    };

    this.carouselOptions.navSpeed = 300;
    
    this.carouselOptions.responsive[1024].items = 5;
    this.carouselOptions.responsive[1024].slideBy = 5;
    this.carouselOptions.responsive[1024].mouseDrage = true;

    this.carouselOptions.responsive[1248].items = 5;
    this.carouselOptions.responsive[1248].slideBy = 5;
    this.carouselOptions.responsive[1248].smouseDrage = true;
    
  }
  ngOnDestroy(){
    this.destroyObs$.next(false);
    this.destroyObs$.complete();
  }

  async removeFromWishlist(product) {
    /* Returned value from removeFromWishlist is a flag to know that product has been
    removed succesffully.
    This flag is return form a Promise.
    */
    const isRemoved = await this.productService.removeFromWishlist(product);
  }

  reviewForm: FormGroup;
  public get rF(){return this.reviewForm.controls}
  reviewRating(e){
    // console.log(e)
  }
  onClick(e){
    this.reviewForm.get('reviewRating').setValue(e['rating'])
  }
  submitReview(){

    if(this.reviewForm.invalid){
      for(let prop in this.reviewForm.controls){
        this.reviewForm.controls[prop].markAsTouched()
      }
      return;
    }
    // console.log(this.reviewForm.value);
  }
  ngAfterViewChecked(){
    // START:: ================ >>> Review stars <<< ===============
    // let stars = Array.from($('#--review-stars-container [class*="star-"]'));
    // stars.forEach((item, i)=>{
    //   $(item).on('mousemove', function(e){
    //     if(e.target.getAttribute('data-counter') == i)
    //         $(item).removeClass('far').addClass('fas');

    //     if(e.target.getAttribute('data-counter') == stars.length - 1)
    //       $(item).removeClass('far').addClass('fas');

    //   });

      // $(item).on('mouseleave', function(e){
      //   if(e.target.getAttribute('data-counter') > i)
      //       $(item).removeClass('fas').addClass('far');
      // });
    // });
    // $('#--review-stars-container [class*="star-"]').
    // stars.forEach((item: HTMLElement, i)=>{
    //   item.addEventListener('mousemove', function(e){
    //     if($(e.target).hasClass('star-3' && i <= 3)){
    //       // $(stars[i]).removeClass('far').addClass('fas');
    //       console.log(stars[i])
    //     }

    //   })
    // })
    // $('#--review-stars-container .Stars').mousemove(function(e){
    //   $(this).removeClass('far').addClass('fas');
    // });
    // $('#--review-stars-container .Stars').mouseleave(function(e){
    //   $(this).removeClass('fas').addClass('far');
    // });
// END:: ================ >>> Review stars <<< ===============
  }

  // changeImage(image){
  //   this.selectedImage = image;
  // }

  // =========================== >>> ZOOMING <<< ==========================
  selectedItem;
  currentImage;
  variantImage;
  private currentImageIndex: number;
  public slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
};
carouselOptions2 = {
  responsive: {
    // xs screen
    0: {
      items: 2,
      stagePadding: 25,
      nav: false,
      margin: 30
    },
    // medium screen
    425: {
      items: 3,
      stagePadding: 25,
      nav: false,
      margin: 30
    },
    // large screen
    1024: {
      items: 3,
      stagePadding: 70,
      nav: false,
      slideBy: 1,
      margin: 30,
      mouseDrag: true
    },
    // xl screen
    1248: {
      items: 3,
      nav: true,
      slideBy: 1,
      margin: 80,
      smartSpeed: 1000,
      mouseDrag: true
    }
  },
  navText: [
    '<i class="fas fa-chevron-left"></i>',
    '<i class="fas fa-chevron-right"></i>',
  ],
  dots: false,
  // navContainer: '#--buttons-container'
}
  changeImage(image: string, position: number) {
      this.currentImage = image;
      this.currentImageIndex = position;
  }

  productImageHover(event, image, i) {
      const zoom = 150;
      const img = event.srcElement;

      const result = document.getElementById('image-zoom-result' + i);

      const a = img.getBoundingClientRect();
      /*calculate the cursor's x and y coordinates, relative to the image:*/
      let x = event.x - a.left;
      let y = event.y - a.top;

      x = x - (zoom / 2);
      y = y - (zoom / 2);
      /*prevent the lens from being positioned outside the image:*/
      if (x > img.width - zoom) {
          x = img.width - zoom;
      }
      if (x < 0) {
          x = 0;
      }
      if (y > img.height - zoom) {
          y = img.height - zoom;
      }
      if (y < 0) {
          y = 0;
      }

      const cx = result.offsetWidth / zoom;
      const cy = result.offsetHeight / zoom;

      result.style.backgroundImage = 'url("' + image + '")';
      result.style.backgroundSize = (img.width * cx) + 'px ' + (img.height * cy) + 'px';
      result.style.backgroundPosition = '-' + (x * cx) + 'px -' + (y * cy) + 'px';
      result.style.display = 'inherit';

      // Hide product details and buttons.
      // document.getElementById('product--details').style.zIndex = '4';
  }

  // Change variant images
  public changeVariantImage(image) {
      this.variantImage = image;
      this.selectedItem = image;
  }

  productImageMouseLeave(e, i) {
      const result = document.getElementById('image-zoom-result' + i);
      result.style.display = 'none';

      // SHOW product details and buttons.
      // document.getElementById('product--details').style.zIndex = '5';
  }

  //  ========================== >>> ZOOMING <<< ============================

  addToCart() {
    // if(!this.product.qty) {
    //   this.product.qty = 1;
    // } else {
    //   this.product.qty++;
    // }
    this.cartService.increaseProductQty(this.product);
  }

}
