import { Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../src/environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  getCollectionsItems(){
    // return this.http.get(environment.apiUrl + '/collections');
    if(isPlatformBrowser(this.platformId)){
    return fetch(environment.apiUrl + '/collections', {
        method: 'GET',
        headers: {
          Authorization: localStorage['TOKEN'] || false,
          // contentType: 'application/json'
        }
      }).then(res => res.json());
    }
  }
}
