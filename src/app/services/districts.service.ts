import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DistrictsService {

  constructor(
    private http: HttpClient
  ) { }

  getAllDistricts(){
    return this.http.get(environment.apiUrl + '/districts');
  }
}
