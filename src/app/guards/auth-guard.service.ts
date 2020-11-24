import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { Injectable } from '@angular/core';
import { Utilities } from './../helpers/utilities';
import { of } from 'rxjs/internal/observable/of';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { DialogService } from './../services/dialog.service';
import { UserService } from '../services/user.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private utils: Utilities,
    private dialogService: DialogService,
    private router: Router,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(isPlatformBrowser(this.platformId)){
          let authorized;
          if(!this.utils.getUserToken()) {
            this.router.navigate(['/']);
            this.dialogService.openDialog({
              msg: 'you have to log in first.',
              loginButtons: true
            });
            authorized = of(false);
          }else {
            authorized = of(true)
          }

        return authorized;
      }      
  
  }
}
