import { Utilities } from './../../helpers/utilities';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Product } from './../../models/product.model';

@Component({
  selector: 'app-product-slider',
  templateUrl: './productSlider.html',
  styleUrls: [
    './productSlider.component.css',
    './productSlider.component.scss'
  ]
})
export class ProductSliderComponent implements OnInit {
  @Input() homePage: boolean;
  id = '';
  @Input() ViewOption: string;

  @Input() carouselOptions: object;
  @Input() items: any[] = [];
  @Input() heading: string;
  @Output() productClicked = new EventEmitter();

  constructor(
    // public utils: Utilities
  ) { }

  ngOnInit() {

  }

  isProduct(item: any): item is Product {
    return 'name' in item;
  }
}
