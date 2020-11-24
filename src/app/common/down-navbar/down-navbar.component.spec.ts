import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownNavbarComponent } from './down-navbar.component';

describe('DownNavbarComponent', () => {
  let component: DownNavbarComponent;
  let fixture: ComponentFixture<DownNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
