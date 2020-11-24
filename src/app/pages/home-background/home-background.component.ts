import { Component, OnInit } from '@angular/core';

import { DefaultService } from './../../services/default/default.service';

@Component({
  selector: 'app-home-background',
  templateUrl: './home-background.component.html',
  styleUrls: [
    './home-background.component.css',
    './home-background.component.scss'
]
})
export class HomeBackgroundComponent implements OnInit {
  slider: any[] = [];
  constructor(
    private defaultService: DefaultService,
  ) { }

  ngOnInit() {
    // Set Carousel[SLIDER] data.
    this.defaultService.getSlider()
    .subscribe( (response:any)=>{
      this.slider = response;
      console.log('slider ::', response);
    })
  }

}
