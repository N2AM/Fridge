import { DistrictsService } from './../../services/districts.service';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MustMatch } from '../../helpers/must-match.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  districts: any[];
  constructor(
    public userService: UserService,
    private fb: FormBuilder,
    private districtsService: DistrictsService
  ) { }

  ngOnInit() {

     // Build Register Form.
     this.registerForm = this.fb.group({
      'email': ['', [Validators.email, Validators.minLength(6), Validators.required]],
      'firstName': ['', [Validators.required, Validators.minLength(3)] ],
      'lastName': ['', [Validators.required, Validators.minLength(3)] ],
      'mobile': ['', [Validators.required, Validators.minLength(11)] ],
      'password': ['', [Validators.required, Validators.minLength(8)] ],
      'confirmPassword': ['', [Validators.required, Validators.minLength(8)] ],
      'addressTitle': ['', [Validators.required]],
      'street': ['', [Validators.required]],
      'nearestLandmark': ['', [Validators.required]],
      'districts': ['', [Validators.required]]
    },{
      validator: MustMatch('password', 'confirmPassword')
    });
    // GET all districts
    this.districtsService.getAllDistricts()
      .subscribe( (districts:any) =>{
        this.districts = districts;
      });
  }
  
  get regf(){
    return this.registerForm.controls;
  }

}
