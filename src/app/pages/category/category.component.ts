import { Utilities } from './../../helpers/utilities';
import { CatregoryService } from './../../services/catregory.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: [
    './category.component.css',
    './category.component.scss'

  ]
})
export class CategoryComponent implements OnInit, AfterViewInit {
  categories$; 
  images: any[] = [];
  carouselOptions = {
    responsive: {
      // xs screen
      0: {
        items: 1,
        stagePadding: 0,
        nav: false,
        dots: false,
      },
      375: {
        items: 1,
        margin: 0,
        nav: false,
        dots: false,
      },
      // medium screen
      425: {
        items: 1,
        margin: 25,
        nav: false,
        dots: false,
      },
      768: {
        items: 2,
        margin: 25,
        nav: false,
        dots: false,
      },
      // large screen
      1024: {
        items: 3,
        // stagePadding: 70,
        nav: true,
        slideBy: 3,
      },
      // xl screen
      1248: {
        items: 3,
        nav: true,
        slideBy: 3,
        // margin: 80,
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

  constructor(
    private categoriesService: CatregoryService,
    public utils: Utilities,
    public router: Router
  ) { }

  ngOnInit() {
    // GET all parent categories.
   this.categories$ = this.categoriesService.getCategories();
   this.categoriesService.getCategories()
    .subscribe( (res: any) => {
      this.images = res;
      // console.log(this.images)
      /*
      .map((item: any) => {
        return item.images[0]
      });
      */
      
    })
  //  this.categories$ = this.categoriesService.getCategories()
      // .subscribe( (response:any)=>{
      //   this.categories = response;
      // });    
  }
  ngAfterViewInit(){
    // let prev = $('#--carousel-previous');
    // let prevBtn = $('#--category-carousel button[class="owl-prev"]');
    // prev.on('click', function(e){
    //   console.log('clicked', prevBtn[0]);
    //   prevBtn[0].addEventListener('click', function(e){$(e.target).click()});
    // })
    // console.log(prevBtn, prev);
  }

}
