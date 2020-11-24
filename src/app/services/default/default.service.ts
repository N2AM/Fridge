import { catchError } from "rxjs/operators";
import { environment } from "./../../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
@Injectable({
  providedIn: "root"
})
export class DefaultService {
  constructor(private http: HttpClient) {}

  getSlider() {
    return this.http.get(environment.apiUrl + "/slider");
  }
}
