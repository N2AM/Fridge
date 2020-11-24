import { User } from "./../models/user.model";
import { Address } from "./../models/address.model";
import { Utilities } from "./../helpers/utilities";
import { environment } from "./../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router, RouterEvent, NavigationEnd } from "@angular/router";
import { tap, catchError, switchMap, map } from "rxjs/operators";
import { UserProfile } from "../models/userProfile.model";
import { BehaviorSubject } from "rxjs";
import { AppStore } from "./../store/app.store";
import { District } from '../models/district.model';
@Injectable({
  providedIn: "root"
})
export class UserService {
  loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private util: Utilities,
    private router: Router,
    private store: AppStore
  ) {
  }

  login(userData) {
    return this.http.post(environment.apiUrl + "/login", userData).pipe(
      tap((response: any) => {
        if (response) this.util.setUserToken(response.auth_token);
        this.isLoggedIn = true;
      })
    );
  }

  register(userData) {
    let data = {
      name: userData.firstName + " " + userData.lastName,
      phone: userData.mobile,
      email: userData.email,
      password: userData.password,
      address_title: userData.addressTitle,
      nearest_landmark: userData.nearestLandmark,
      street: userData.street,
      district_id: userData.districts
    };
    return this.http.post(environment.apiUrl + "/register", data).pipe(
      tap((response: any) => {
        if (response) this.util.setUserToken(response.auth_token);
      }),
      catchError(err => {
        console.log("error from service::", err);
        return err;
      })
    );
  }

  logOut() {
    delete this.util.localStorage["TOKEN"];
    this.store.cart = [];
    this.isLoggedIn = false;
    this.router.navigate(['/'])
    
    this.router.events.subscribe((event: RouterEvent) => {
      if(event instanceof NavigationEnd) {
        console.log('router event', event.url);
        if(event.url != '/') {
          this.router.navigate(['/']);
        } else {
          location.reload();
        }
      }
    })
  }

  set isLoggedIn(value: any) {
    this.loggedIn$.next(value);
  }

  getUserProfile() {
    return this.http.get<UserProfile>(environment.apiUrl + "/userprofile");
  }
  getUserAddresses() {
    return this.http.get<Address[]>(environment.apiUrl + "/address")
  }
  editUser(data) {
    return this.http.put(environment.apiUrl + "/user", data);
  }
  editUserAddress(id, data) {
    return this.http.put(environment.apiUrl + "/address/" + id, data);
  }
  addUserAddress(data) {
    return this.http.post(environment.apiUrl + "/address", data);
  }
  deleteUserAddress(id) {
    return this.http.delete(environment.apiUrl + "/address/" + id);
  }
}
