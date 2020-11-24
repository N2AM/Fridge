import { CollectionService } from './../../services/collection.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from './../../services/user.service';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
@Component({
  selector: 'app-recommended-by-us',
  templateUrl: './recommended-by-us.component.html',
  styleUrls: ['./recommended-by-us.component.css']
})
export class RecommendedByUsComponent implements OnInit {
  carouselOptions;
  collections: any[] = [];

  constructor(
    private collectionService: CollectionService,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: any
  
  ) { }

  ngOnInit() {
    this.carouselOptions = {

      responsive: {
        // xs screen
        0: {
          items: 1,
          margin: 25,
          nav: false
        },
        // medium screen
        425: {
          items: 2,
          stagePadding: 25,
          nav: false,
          margin: 15
        },
        // large screen
        1024: {
          items: 5,
          stagePadding: 70,
          nav: false,
          slideBy: 1,
          mouseDrag: false
        },
        // xl screen
        1248: {
          items: 5,
          nav: true,
          slideBy: 1,
          margin: 80,
          smartSpeed: 1000,
          mouseDrag: false
        }
      },
      navText: [
        '<div class="--next-arrow"></div>',
        '<div class="--prev-arrow"></div>',
      ],
      dots: false,
      // navContainerClass: '--buttons-container'

    };

    this.userService.loggedIn$.subscribe((isloggedIn: any)=>{
    if(isPlatformBrowser(this.platformId)){
      this.getCollectionItems();
    }
    });
  }

  getCollectionItems() {
    this.collectionService.getCollectionsItems()
      .then((response: any) => {
        // let arr = [];
        // for(let obj of response){
        //   if(obj != response[0])
        //     arr.push(...obj.items)
        // }
        console.log('recived collections ::', response)
        this.collections = response;
      });
  }
}
