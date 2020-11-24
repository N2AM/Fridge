import { DialogService } from "src/app/services/dialog.service";
import { ProductService } from "./../../services/product.service";
import { Observable, fromEvent, BehaviorSubject } from "rxjs";
import { Cart } from "./../../models/cart.model";
import { Product } from "./../../models/product.model";
import { CartService } from "./../../services/cart.service";
import { Router, RouterEvent, NavigationEnd } from "@angular/router";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  AfterViewChecked
} from "@angular/core";

import { Utilities } from "./../../helpers/utilities";
import { UserService } from "./../../services/user.service";
import { CatregoryService } from "./../../services/catregory.service";
import { MustMatch } from "../../helpers/must-match.validator";
import { DistrictsService } from "./../../services/districts.service";
import { NgbDropdownConfig } from "@ng-bootstrap/ng-bootstrap";
import { AppStore } from "../../store/app.store";
import {
  startWith,
  map,
  debounceTime,
  distinctUntilChanged,
  switchMap
} from "rxjs/operators";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { documentFactory } from '@ng-toolkit/universal';

declare var $: any;
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: [
    "./header.component.css",
    "./header.component.scss",
    "./header.component.responsice.scss"
  ],
  providers: [NgbDropdownConfig]
})
export class HeaderComponent
  implements OnInit, AfterViewInit, AfterViewChecked {
  // @ViewChild("input1") input1: ElementRef;
  public collapsed = false;
  categoriesTree: any[] = [];
  districts: any[] = [];
  autocompleteProduct = new FormControl();
  filteredOptions: Observable<Product[]>;
  loginForm: FormGroup;
  registerForm: FormGroup;
  products: Product[];
  // cart items
  cartTotal: any;
  cart: Cart;

  // Login - Register Modal Close Buttons.
  closeRegModalButton;
  closeLoginModalButton;
  modalFromModal$ = new BehaviorSubject(false);
  resetScroll() {
    let body = document.getElementsByTagName('body')[0],
      navbar = document.getElementById('--navbar');
    body.classList.remove('--height--100vh');
    body.classList.remove('--overflow-y-hidden');
    navbar.classList.remove('--mr-17px');
    body.classList.remove('--pr-17px');

  }
  preventScroll() {
    let body = document.getElementsByTagName('body')[0],
        navbar = document.getElementById('--navbar');
    body.classList.add('--height--100vh');
    body.classList.add('--overflow-y-hidden');
    navbar.classList.add('--mr-17px');
    body.classList.add('--pr-17px');
  }
  modalBackdropListener() {
    Array.from(document.querySelectorAll('.modal')).forEach(item => {
      item.addEventListener('click', (e)=>{
        // e.stopPropagation();
        this.modalFromModal$.next(false);
      })
    })
    document.querySelector('#--to-register-modal').addEventListener('click', (e)=>{
        e.stopPropagation();
      });
    document.querySelector('#--to-login-modal').addEventListener('click', (e)=>{
        e.stopPropagation();
      });
  }
  closeLoginModal() {
    this.preventScroll();
      this.closeLoginModalButton.click();

    // reset form
    this.resetLoginForm();
  }
  closeRegisterModal() {
  
      this.closeRegModalButton.click();

    this.resetRegisterForm();
  }

  constructor(
    private router: Router,
    private categoryService: CatregoryService,
    private districtsService: DistrictsService,
    public userService: UserService,
    public util: Utilities,
    private fb: FormBuilder,
    public config: NgbDropdownConfig,
    private store: AppStore,
    private cartService: CartService,
    private productService: ProductService,
    private ngxService: NgxUiLoaderService,
    private dialogService: DialogService
  ) {
    config.placement = "bottom-left";
    config.autoClose = false;
    router.events.subscribe(val => {
      if (val) {
        $("#SearchModel").modal("hide");
        // $("#SearchModel, .cdk-overlay-container").hide();
        this.autocompleteProduct.setValue("");
      }
    });
  }

  ngOnInit() {
    // document.addEventListener("keypress", function(e) {
    //   let code = e.which || e.keyCode;
    //   if (code == 38 || code == 40) {
    //     console.log("sss");
    //     $("#searchInput").focusout();
    //     // Up
    //   }
    // });
    $("#searchInput").focusout(function() {
      this.products = [];
    });
    // $(document).keydown(function(e) {
    //   let code = e.which || e.keyCode;
    //   if (code == 38 || code == 40) {
    //     console.log("sss");
    //     $("#searchInput").blur();
    //     // $(":text").attr("disabled", "disabled");
    //     // Up
    //   }
    // });
    // Build LOGIN Form.
    this.initializeLoginForm();

    // Build Register Form.
    this.initializeRegisterForm();

    $("#searchInput").focusout(function() {
      $(this).val(" ");
    });
    // this.input1.nativeElement.focus();

    // Configration for dropdown.
    // this.config.placement = 'bottom-left';
    // this.config.autoClose = false;

    // If TOKEN Exist, set isLoggedIn = true;
    // this.productService
    //   .autoCompleteSearch()
    //   .subscribe((products: Product[]) => {
    //     this.products = products;
    //     // console.log(this.products);
    //   });

    // 'GET' All Categories tree.
    this.categoryService.categories.subscribe((categoriesTree: any) => {
      console.log("categories tree ::", categoriesTree);
      this.categoriesTree = categoriesTree;
    });
    this.categoryService.getCategoryTree();

    // GET all districts
    this.districtsService.getAllDistricts().subscribe((districts: any) => {
      this.districts = districts;
      this.store.districts = districts;
    });

    // Design Stuff..
    // make navbar sticky..
    this.router.events.subscribe((route: RouterEvent) => {
      if (route instanceof NavigationEnd) {
        console.log("route url is ::", route.url);
        if (route.url == "/" || route.url == "/customer-service/contact-us") {
          $("#--app-root-container").removeClass(
            "--body-padding-for-fixed-navbar"
          );
        } else {
          $("#--app-root-container").addClass(
            "--body-padding-for-fixed-navbar"
          );
        }
      } else return;
    });
    $(window).on("scroll", function(e) {
      if ($(this).scrollTop() >= 82) {
        $("nav#--navbar").addClass("--nav-main-background-color");
        // $('body').addClass('--body-padding-for-fixed-navbar');
      } else {
        $("nav#--navbar").removeClass("--nav-main-background-color");
        // $('body').removeClass('--body-padding-for-fixed-navbar');
      }
    });

    // Get cart total number from API
    this.userService.loggedIn$.subscribe((isLoggedIn: boolean) => {
      console.log("user is logged in ? :: ", isLoggedIn);
      if (isLoggedIn == true) {
        this.cartService.getCart().subscribe((res: Product[]) => {
          // Set cart value to APP STORE
          this.store.cart = res;
        });

        // get cart value from APP STORE
        this.store.cart$.subscribe((cart: Cart) => {
          this.cart = cart;
          cart.itemsQty
            ? (this.cartTotal = cart.itemsQty)
            : (this.cartTotal = 0);
          console.log("cart items ::From cart$", cart, this.cartTotal);
        });
      }
    });
  }

  ngAfterViewInit() {
    let stream = fromEvent(document.getElementById("searchInput"), "input");
    stream
      .pipe(
        map((val: any) => {
          if (val.target.value.length > 0) return val.target.value;
          else return " ";
        }),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((val: any) => {
          if (val && val.length > 0) val = val.trim();
          // console.log(val);
          if (val && val.length > 0) {
            return this.productService.searchByName(val);
          } else return [];
        })
      )
      .subscribe((products: any) => {
        console.log(products);
        this.products = products;
      });
    this.closeRegModalButton = document.getElementById(
      "--register-form-modal-trigger"
    );
    this.closeLoginModalButton = document.getElementById(
      "--login-form-modal-trigger"
    );

    window.addEventListener('keyup', (e)=>{
      if(e.keyCode == 27) {
        console.log('esc clicked.')
        this.modalFromModal$.next(false);
      }
    });

    

    $("#LoginModel").on("hidden.bs.modal", e => {
      e.preventDefault();
      this.modalFromModal$.subscribe((isModalToModal)=>{
        if(isModalToModal) {
          this.preventScroll();
        } else {
          this.resetScroll();
        }
      });


      this.resetLoginForm();
      // this.dialogService.resetBodyScroll();
    });

    $("#RegisterModel").on("hidden.bs.modal", e => {
      e.preventDefault();
      this.modalFromModal$.subscribe((isModalToModal)=>{
        console.log('is modal to modal ?', isModalToModal)
        if(isModalToModal) {
          this.preventScroll();
        } else {
          this.resetScroll();
        }
      })


      // console.log("modal is closed.");
      // let body = document.getElementsByTagName('body')[0];
      // body.classList.remove('--height--100vh');
      // body.classList.remove('--overflow-y-hidden');
      // body.classList.remove('--pr-17px');
      this.resetRegisterForm();
      // this.dialogService.resetBodyScroll();
    });
    const loginModal = document.getElementById("LoginModel");
    const registerModal = document.getElementById("RegisterModel");

    this.modalsOpenedSolveScrollIssue();
  }

  ngAfterViewChecked() {}

  initializeRegisterForm() {
    this.registerForm = this.fb.group(
      {
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
        firstName: [
          "",
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(25),
            Validators.pattern("[a-zA-Z ]*")
          ]
        ],
        lastName: [
          "",
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(25),
            Validators.pattern("[a-zA-Z ]*")
          ]
        ],
        mobile: [
          "",
          [
            Validators.required,
            Validators.minLength(11),
            Validators.maxLength(15),
            Validators.pattern("^[0-9]*$")
          ]
        ],
        password: ["", [Validators.required, Validators.minLength(8)]],
        confirmPassword: ["", [Validators.required, Validators.minLength(8)]]
        // addressTitle: [
        //   "",
        //   [
        //     Validators.required,
        //     Validators.maxLength(40),
        //     Validators.minLength(3)
        //   ]
        // ],
        // street: ["", [Validators.required, Validators.maxLength(40)]],
        // nearestLandmark: [
        //   "",
        //   [
        //     Validators.required,
        //     Validators.maxLength(40),
        //     Validators.minLength(3)
        //   ]
        // ],
        // districts: ["", [Validators.required]]
      },
      {
        validator: MustMatch("password", "confirmPassword")
      }
    );
  }
  resetRegisterForm() {
    this.registerForm.reset();
    // for(let prop in this.registerForm.controls) {
    //   this.registerForm.controls[prop].setErrors(null)
    // }
  }

  initializeLoginForm() {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]]
    });
  }
  resetLoginForm() {
    this.loginForm.reset();
    // for(let prop in this.loginForm.controls) {
    //   this.registerForm.controls[prop].setErrors(null)
    // }
  }

  private _filter(value: string): Product[] {
    console.log(value);
    const filterValue = value.toLowerCase();
    if (this.products) {
      return this.products.filter(option =>
        option.name_en.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
  }
  get regf() {
    return this.registerForm.controls;
  }
  get logf() {
    return this.loginForm.controls;
  }

  loginLoadingToRefreshPage = false;
  loginAPIError = {
    show: false,
    error: {}
  };
  login() {
    // Regular Expression for email validation.
    let emailRegx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegx.test(this.loginForm.value["email"])) {
      // console.log('is email ?', emailRegx.test(this.loginForm.value['email']))
      this.loginForm.get("email").setErrors({ email: true });
    }

    console.log("login form is valid? ::", this.loginForm.valid);
    if (!this.loginForm.valid) {
      for (let key in this.loginForm.controls) {
        this.loginForm.controls[key].markAsTouched();
      }
      return;
    }

    this.ngxService.start();
    this.userService.login(this.loginForm.value).subscribe(
      (response: any) => {
        if (this.util.getUserToken()) {
          // Close login Modal if token Exist.
          // this.closeLoginModalButton.click();
          this.loginLoadingToRefreshPage = true;
          this.ngxService.stop();

          // reload application to retrieve data from API with user token.
          location.reload();
          this.router.navigate(["/"]);
        }
      },
      err => {
        // console.log("login API error is ::", err);
        // this.loginAPIError.show = true;
        // this.loginAPIError.error = err.error.message;
        this.ngxService.stop();
      }
    );
  }

  register() {
    // console.log('register is valid? ::', this.registerForm.valid)
    console.log("register is invalid? ::", this.registerForm.invalid);
    if (!this.registerForm.valid) {
      for (let key in this.registerForm.controls)
        this.registerForm.controls[key].markAsTouched();

      return;
    }
    this.userService
      .register(this.registerForm.value)
      .subscribe((response: any) => {
        if (this.util.getUserToken()) {
          // set isLoggedIn true.
          this.userService.isLoggedIn = true;

          // Hide Modal if reponse is 200 and token is setted on localStorage.
          this.closeRegModalButton.click();
          (document.querySelector(
            ".modal-backdrop"
          ) as HTMLElement).style.display = "none";

          // reset registerForm fields
          this.registerForm.reset();
        }
      });
  }

  logout() {
    this.userService.logOut();
  }

  @Input() RedNav: any;
  /*show or hide Category */
  showCategories() {
    // document.getElementById('Categories').click();
    // $('#CategoriesList').show(500);
  }

  HideCategories() {
    // $('#CategoriesList').hide(500);
  }
  /* Show User Options (search icon)*/
  showUserOptions() {
    // document.getElementById('Help').click();
    $("#HelpList").show(500);
  }
  HideUserOptions() {
    // document.getElementById('Help').click();
    $("#HelpList").hide(500);
  }
  /*Show Register Modal*/
  ShowRegisterModal() {
    // hide login then show register
    // $('#LoginModel').modal('hide');
    // this.dialogService.preventBodyScroll();
    this.closeLoginModal();
    $("#RegisterModel").modal("show");

    let body = document.getElementsByTagName("body")[0];
    body.classList.add("modal-open");
    body.style.paddingRight = "17px";
  }

  modalsOpenedSolveScrollIssue() {
    $("#LoginModel").on("shown.bs.modal", () => {
      // add to body modal-open class
      let body = document.getElementsByTagName("body")[0];
      body.classList.add("modal-open");
      body.style.paddingRight = "17px";
      this.modalBackdropListener();
      // this.dialogService.preventBodyScroll();

      // , appRoot = document.getElementById('app-root');
      // appRoot.style.overflowX = 'hidden';
      // body.style.height = '100vh';
      // body.style.overflowY = 'hidden';
    });

    $("#RegisterModel").on("shown.bs.modal", () => {
      // add to body modal-open class
      let body = document.getElementsByTagName("body")[0];
      body.classList.add("modal-open");
      body.style.paddingRight = "17px";
      this.modalBackdropListener();
      // this.dialogService.preventBodyScroll();

      // , appRoot = document.getElementById('app-root');
      // appRoot.style.overflowX = 'hidden';
      // body.style.height = '100vh';
      // body.style.overflowY = 'hidden';
    });
  }

  /*Show Login Modal*/
  ShowLoginModal() {
    // $('#RegisterModel').modal('hide');
    // this.dialogService.preventBodyScroll();
    this.closeRegisterModal();
    $("#LoginModel").modal("show");
    let body = document.getElementsByTagName("body")[0];
    body.classList.add("modal-open");
    body.style.paddingRight = "17px";
    
  }
  search(event) {
    if (event.target.value) {
      let str = event.target.value;
      // str.trim()
      this.router.navigate(["/search/" + str.trim()]);
    }
    $("#SearchModel, .modal-backdrop, .cdk-overlay-container").hide();
  }
  focus() {
    $("#searchInput").focus();
  }
  removeFromCart(id) {
    this.cartService.addAndDeleteToFromCart(id, 0).subscribe((res: any) => {
      this.store.cart = res;
    });
  }
  showAuto(event) {
    // $("#SearchModel, .cdk-overlay-container").show();
  }
}
