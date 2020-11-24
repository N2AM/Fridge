import { Observable, BehaviorSubject } from "rxjs";
import { Brand } from "./../models/brand.model";
import { Product } from "./../models/product.model";
import { environment } from "./../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Category } from "../models/category.model";
import { take } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class CatregoryService {
  private url = environment.apiUrl;
  categories = new BehaviorSubject(<Category[]>null);
  constructor(private http: HttpClient) {}

  getCategoryTree() {
    return this.http
      .get<Category[]>(this.url + "/categorytree")
      .pipe(take(1))
      .subscribe((res: Category[]) => {
        this.categories.next(res);
      });
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(environment.apiUrl + "/categories");
  }

  getAllCategoryProducts(categoryId): Observable<Product[]> {
    return this.http.get<Product[]>(
      environment.apiUrl + "/products?id=" + categoryId
    );
  }
  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(environment.apiUrl + "/getbrands");
  }
  getBrandsOfCategory(id): Observable<Brand[]> {
    return this.http.get<Brand[]>(
      environment.apiUrl + "/categories/products?id=" + id
    );
  }
}
