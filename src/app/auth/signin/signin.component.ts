import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  loginForm: FormGroup;
  error : string;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      'email': ['', []],
      'password': ['', []]
    });
  }
  login(){
    if(this.loginForm.invalid){
      for(let prop in this.loginForm.controls){
        this.loginForm.controls[prop].markAsTouched();
      }
      return;
    }
    this.userService.login(this.loginForm.value)
      .subscribe((res: any)=>{
        if(res['auth_token']){
          this.router.navigate(['/']);
        }
      }, err => {
        console.log(err);
        if(err['status'] == 401){
          this.error = 'Email or password is invalid.'
        }
      });
  }
}
