import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css', './offers.component.scss']
})
export class OffersComponent implements OnInit {

  carouselOptions = {
    responsive: {
      // xs screen
      0: {
        items: 1,
        stagePadding: 25,
        nav: false
      },
      320: {
        items: 1,
        // stagePadding: 25,
        // margin: 30,
        nav: false
      },
      375: {
        items: 1,
        // stagePadding: 25,
        margin: 30,
        nav: false
      },
      // medium screen
      425: {
        items: 1,
        stagePadding: 25,
        margin: 30,
        nav: false
      },
      768: {
        items: 1,
        stagePadding: 25,
        margin: 25,
        nav: false
      },
      // large screen
      1024: {
        items: 1,
        stagePadding: 70,
        nav: true,
        slideBy: 1,
        
      },
      // xl screen
      1248: {
        items: 1,
        nav: true,
        slideBy: 1,
        margin: 80,
        smartSpeed: 1000,
      }
    },
    navText: [
      '<div class="--prev-indicator"></div>',
      '<div class="--next-indicator"></div>',
    ],
    dots: false,
    navSpeed: 300
    // navContainer: '#--buttons-container'

  };
  offers = [
    {
      title: 'cherry',
      desc: `lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever `,
      price: 58,
      id: 275
    },
    {
      title: 'cherry',
      desc: `lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever `,
      price: 58,
      id: 275
    }
  ]
  constructor() { }

  ngOnInit() {
  }

}
