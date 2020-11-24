import { Component, OnInit } from "@angular/core";
import * as $ from "jquery";
@Component({
  selector: "app-how-it-work",
  templateUrl: "./how-it-work.component.html",
  styleUrls: ["./how-it-work.component.css", "./how-it-work.component.scss"]
})
export class HowItWorkComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    $(".box-1").hover(function() {
      $(".one span").toggleClass("bg-p");
    });
    $(".box-2").hover(function() {
      $(".two span").toggleClass("bg-p");
    });
    $(".box-3").hover(function() {
      $(".three span").toggleClass("bg-p");
    });
  }
}
