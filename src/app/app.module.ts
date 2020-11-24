import { LoginDialogComponent } from "./shared/login-dialog/login-dialog.component";
import { AuthInterceptor } from "./services/auth-interceptor.service";
import { SharedModule } from "./shared/shared.module";
import { NgtUniversalModule } from "@ng-toolkit/universal";
import { CommonModule } from "@angular/common";
import { TransferHttpCacheModule } from "@nguniversal/common";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./common/header/header.component";
import { FooterComponent } from "./common/footer/footer.component";
import { HomeComponent } from "./pages/home/home.component";
import { OffersComponent } from "./pages/offers/offers.component";
import { CategoryComponent } from "./pages/category/category.component";
import { NewArrivalsComponent } from "./pages/new-arrivals/new-arrivals.component";
import { HowItWorkComponent } from "./pages/how-it-work/how-it-work.component";
import { RecommendedByUsComponent } from "./pages/recommended-by-us/recommended-by-us.component";
import { RegisterComponent } from "./pages/register/register.component";
import { ClickOutsideModule } from "ng-click-outside";
import { AppRoutingModule } from "./app-routing.module";
import { ProductsComponent } from "./pages/products/products.component";
import { HomeBackgroundComponent } from "./pages/home-background/home-background.component";
import { ProductItemComponent } from "./pages/product-item/product-item.component";
import { AboutComponent } from "./pages/about/about.component";
import { NgxUiLoaderModule, SPINNER } from "ngx-ui-loader";
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { LoginComponent } from "./pages/login/login.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MyOrdersModule } from "./my-orders/my-orders.module";
import { UserProfileModule } from "./user-profile/user-profile.module";
import { CustomerServiceModule } from "./customer-service/customer-service.module";
import { MatInputModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { SearchResultComponent } from './search-result/search-result.component';
import { AddAddressFormDialog } from './shared/add-address-form-dialog/add-address-form-dialog.component';
import { DownNavbarComponent } from './common/down-navbar/down-navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    OffersComponent,
    CategoryComponent,
    NewArrivalsComponent,
    HowItWorkComponent,
    RecommendedByUsComponent,
    RegisterComponent,
    ProductsComponent,
    HomeBackgroundComponent,
    AboutComponent,
    LoginComponent,
    LoginDialogComponent,
    AddAddressFormDialog,
    SearchResultComponent,
    DownNavbarComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    NgtUniversalModule,
    TransferHttpCacheModule,
    HttpClientModule,
    BrowserModule.withServerTransition({ appId: "my-app" }),
    ClickOutsideModule,
    AppRoutingModule,
    // Import NgxUiLoaderModule
    NgxUiLoaderModule.forRoot({
      "bgsColor": "#00ACC1",
      "bgsOpacity": 0.5,
      "bgsPosition": "bottom-right",
      "bgsSize": 60,
      "bgsType": "double-bounce",
      "blur": 5,
      "fgsColor": "#00ACC1",
      "fgsPosition": "center-center",
      "fgsSize": 60,
      "fgsType": "double-bounce",
      "gap": 24,
      "logoPosition": "center-center",
      "logoSize": 120,
      "logoUrl": "",
      "masterLoaderId": "master",
      "overlayBorderRadius": "0",
      "overlayColor": "rgba(40, 40, 40, 0.8)",
      "pbColor": "#f15758",
      "pbDirection": "ltr",
      "pbThickness": 3,
      "hasProgressBar": true,
      "text": "",
      "textColor": "#FFFFFF",
      "textPosition": "center-center",
      "threshold": 500
    }),
    HttpClientModule,
    SharedModule,
    MyOrdersModule,
    UserProfileModule,
    CustomerServiceModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    NgxPaginationModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}

  ],
  entryComponents: [LoginDialogComponent, AddAddressFormDialog]
})
export class AppModule {}
