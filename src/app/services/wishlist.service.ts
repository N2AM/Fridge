import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(
    private http: HttpClient
  ) { }

  getWishlist() {
    return this.http.get(environment.apiUrl + '/user/favorites');
  }
}
