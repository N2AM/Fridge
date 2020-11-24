import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { CategoryComponent } from "./pages/category/category.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes, PreloadAllModules } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { ProductsComponent } from "./pages/products/products.component";
import { AboutComponent } from "./pages/about/about.component";
import { SearchResultComponent } from "./search-result/search-result.component";

// Guards
import { AuthGuard } from "./guards/auth-guard.service";

const routes: Routes = [
  { path: "", component: HomeComponent, pathMatch: "full" },
  { path: "auth", loadChildren: "./auth/auth.module#AuthModule" },
  {
    path: "categories",
    loadChildren: "./categories/categories.module#CategoriesModule"
  },
  {
    path: "wishlist",
    loadChildren: "./wishlist/wishlist.module#WishlistModule",
    canActivate: [AuthGuard]
  },
  { path: "product", loadChildren: "./product/product.module#ProductModule" },
  // { path: "payment", loadChildren: "./payment/payment.module#PaymentModule" },
  {
    path: "cart",
    loadChildren: "./cart/cart.module#CartModule"
    // canActivate: [AuthGuard]
  },
  // { path: "confirm", loadChildren: "./confirm/confirm.module#ConfirmModule" },
  {
    path: "checkout",
    loadChildren: "./checkout/checkout.module#CheckoutModule",
    canActivate: [AuthGuard]
  },
  {
    path: "orders",
    loadChildren: "./my-orders/my-orders.module#MyOrdersModule",
    canActivate: [AuthGuard]
  },
  {
    path: "my-account",
    loadChildren: "./user-profile/user-profile.module#UserProfileModule",
    canActivate: [AuthGuard]
  },
  {
    path: "customer-service",
    loadChildren:
      "./customer-service/customer-service.module#CustomerServiceModule"
  },
  { path: "products", component: ProductsComponent, pathMatch: "full" },
  { path: "about", component: AboutComponent, pathMatch: "full" },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "search/:input", component: SearchResultComponent },
  { path: "**", redirectTo: "" }
];

@NgModule({
  exports: [RouterModule],
  // {preloadingStrategy: PreloadAllModules}
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: "enabled"
    })
  ]
})
export class AppRoutingModule {}
