import { StarRatingModule } from 'angular-star-rating';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwlModule } from 'ngx-owl-carousel';
import { RouterModule } from '@angular/router';

// PACKAGES MODULES
// NGBootstrap
import { NgBootstrapModule } from "../ng-bootstrap/ng-bootstrap.module";
// Angular Material
import { AngularMaterialModule } from "../angular-material/angular-material.module";

// Ngx-slick-carousel
import { SlickCarouselModule } from "ngx-slick-carousel";

// PACKAGES MODULES

// ::Components
import { ProductItemComponent } from "./../pages/product-item/product-item.component";
import { ProductSliderComponent } from "./../pages/product Slider/productSlider.component";
import { OrderSummaryComponent } from "./../pages/order-summary/order-summary.component";
import { CheckboxDirective } from './directives/checkbox.directive';

@NgModule({
  declarations: [
    ProductItemComponent,
    ProductSliderComponent,
    OrderSummaryComponent,
    CheckboxDirective,
  ],
  imports: [
    CommonModule,
    OwlModule,
    NgBootstrapModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    SlickCarouselModule,
    StarRatingModule.forRoot(),
  ],
  exports: [
    OwlModule,
    NgBootstrapModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ProductItemComponent,
    ProductSliderComponent,
    OrderSummaryComponent,
    SlickCarouselModule,
    StarRatingModule,
    CheckboxDirective
  ],
  entryComponents: []
})
export class SharedModule {}
