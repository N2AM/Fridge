import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AppStore } from "./../../store/app.store";
import { UserService } from "./../../services/user.service";
import { District } from "./../../models/district.model";

@Component({
  selector: "app-add-address-form-dialog",
  templateUrl: "./add-address-form-dialog.component.html",
  styleUrls: ["./add-address-form-dialog.component.scss"]
})
export class AddAddressFormDialog implements OnInit {
  cashForm: FormGroup;
  districts$;

  formSubmittedCounter: number = 0;

  @ViewChild("closeForm") closeForm: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<AddAddressFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private store: AppStore,
    private userService: UserService
  ) {}

  ngOnInit() {
    /*
        "address_title": "string",
        "address_phone": "0222958478",
        "nearest_landmark": "string",
        "lat": 645.484,
        "lng": 645.484,
        "street": "17 street",
        "district_id": 1,
        "city": "Cairo"
    */
    this.districts$ = this.store.districts$;

    this.cashForm = this.fb.group({
      city: [
        "",
        [
          Validators.required,
          Validators.maxLength(58),
          Validators.pattern("[a-zA-Z ]*")
        ]
      ],
      street: ["", [Validators.required, Validators.maxLength(28)]],
      nearest_landmark: ["", [Validators.required, Validators.maxLength(58)]],
      district_id: ["", [Validators.required]],
      apartment_no: [
        "",
        [
          Validators.required,
          Validators.maxLength(5),
          Validators.pattern("^[0-9]*$")
        ]
      ],
      floor_no: [
        "",
        [Validators.required,
        Validators.maxLength(5),
        Validators.pattern("^[0-9]*$")
        ]
      ],
      building_no: [
        "",
        [
          Validators.required,
          Validators.maxLength(5),
          Validators.pattern("^[0-9]*$")
        ]
      ]
    });
  }

  // getter  for cash form controls.
  get cashF() {
    return this.cashForm.controls;
  }

  AddNewAddress() {
    if(!this.formSubmittedCounter) {
      this.formSubmittedCounter = 1;
    } else {
      this.formSubmittedCounter++;
    }

    if (this.cashForm.invalid) {
      for (let prop in this.cashForm.controls) {
        this.cashForm.controls[prop].markAsTouched();
      }
      return;
    }

    if(this.formSubmittedCounter == 1) {
      this.userService
      .addUserAddress(this.cashForm.value)
      .subscribe((res: any) => {
        if(res) {
          let address = res[res.length - 1];
          console.log('addresses after addding one::', res)
          // this.closeForm.nativeElement.click();
          this.dialogRef.close();
          this.store.addedAddress$.next(address);
          this.formSubmittedCounter = 0;
        }
      }, err => {
        this.formSubmittedCounter = 0;
      });
    } else {
      return;
    }
   
  }
}
