import { UserService } from './../services/user.service';
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';
import {Inject, Injectable} from '@angular/core';
import { DialogService } from './../services/dialog.service';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { Overlay } from '@angular/cdk/overlay';
import { LoginDialogComponent } from '../shared/login-dialog/login-dialog.component';
declare var $: any;

@Injectable({
    providedIn: 'root'
})
export class Utilities {
    public verticalCarousel = {
        responsive: {
          // xs screen
          0: {
            items: 1,
            stagePadding: 25,
            nav: false
          },
          // medium screen
          425: {
            items: 1,
            stagePadding: 25,
            nav: false
          },
          // large screen
          1024: {
            items: 3,
            stagePadding: 70,
            nav: false,
            slideBy: 1
          },
          // xl screen
          1248: {
            items: 3,
            nav: true,
            slideBy: 1,
            margin: 80,
            smartSpeed: 1000,
          }
        },
        navText: [
          '<i class="fas fa-chevron-left"></i>',
          '<i class="fas fa-chevron-right"></i>',
        ],
        dots: false,
        // navContainer: '#--buttons-container'

      };
    constructor(
        @Inject(LOCAL_STORAGE) public localStorage: any,
        @Inject(WINDOW) public window: any,
        private dialog: MatDialog,
        private overlay: Overlay
        // private dialogService: DialogService
        ) {}

    getUserToken() {
      let token;
      if(this.localStorage['TOKEN'])
          token = this.localStorage['TOKEN'];
        else 
          token = false;
        return token;
    }
    setUserToken(token: string) {
        this.localStorage['TOKEN'] = token; 
    }
    
    navigateToTop(){
      $('body, html').animate({
        scrollTop: '0px'
      })
    }

    userIsNotLoggedInWithDialog(dialogData) {
      if (!this.getUserToken()) {
        this.dialog.open(LoginDialogComponent, {
          data: dialogData,
          closeOnNavigation: true,
          scrollStrategy: this.overlay.scrollStrategies.noop()
        })
          .afterClosed()
          .subscribe(res => {
            if (res) {
              // if user click yes do something.
            }
          });
        return true;
      }
    }
}