import { WINDOW } from "@ng-toolkit/universal";
import { Component, Inject, OnInit, AfterViewInit } from "@angular/core";
import {
  Router,
  RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel
} from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { HttpClient } from "@angular/common/http"; // Import NgxUiLoaderService
import { Utilities } from "./helpers/utilities";
import { UserService } from "./services/user.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, AfterViewInit {
  RedNav = true;
  constructor(
    @Inject(WINDOW) private window: Window,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private httpClient: HttpClient,
    private util: Utilities,
    private userService: UserService
  ) {}
  ngOnInit() {
    if (this.util.getUserToken()) this.userService.isLoggedIn = true;

    this.router.events.subscribe(val => {
      console.log(val);
      // check if you enter the home page or not to change headerColor
      if (
        window.location.pathname === "/" ||
        window.location.pathname === "/customer-service/contact-us"
        //  window.location.pathname === '/about'
      ) {
        this.RedNav = false;
      } else {
        this.RedNav = true;
      }

      // console.log('ROUTER EVENTS ::', val);

      if (val instanceof RouterEvent) {
        if (val instanceof NavigationStart || val instanceof NavigationEnd) {
        }
      }
      // // Temporarily solving problem of loading scripts
      // const testScript = document.createElement('script');
      // testScript.setAttribute('id', 'SliderScript');
      // testScript.setAttribute('src', 'assets/js/SliderJquery.js');
      // document.body.appendChild(testScript);
    });
    // start foreground spinner of the master loader with 'default' taskId
    // Stop the foreground loading after 5s

    // OR

    // Do something here...

    // start foreground spinner of the loader "loader-01" with 'default' taskId
    // Stop the foreground loading after 5s
  }

  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.ngxService.start();
        this.ngxService.startBackground("do-background-things");
        this.ngxService.stopBackground("do-background-things");
        this.ngxService.startLoader("loader-0");
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel
      ) {
        this.ngxService.stop();
        this.ngxService.stopLoader("loader-0");
      }
    });
  }
  onActive() {
    window.scrollTo(0, 0);
  }
}
