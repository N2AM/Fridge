import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class CustomerService {
  constructor(private http: HttpClient) {}
  getFAQ() {
    return this.http.get(environment.apiUrl + "/faq");
  }
  postContact(data) {
    return this.http.post(environment.apiUrl + "/contact-us", data);
  }
}
