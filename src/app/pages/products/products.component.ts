import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  Status_exp = 'Notify';
  constructor() {
    $('#Brands').show();
  }
  ngOnInit() {
  }

}
