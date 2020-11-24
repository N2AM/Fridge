import { DialogService } from "./../../services/dialog.service";
import { Address } from "./../../models/address.model";
import { DistrictsService } from "./../../services/districts.service";
import { UserService } from "./../../services/user.service";
import { UserProfile } from "./../../models/userProfile.model";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { MustMatch } from "../../helpers/must-match.validator";
import { AppStore } from "../../store/app.store";

@Component({
  selector: "app-my-account",
  templateUrl: "./my-account.component.html",
  styleUrls: ["./my-account.component.scss"]
})
export class MyAccountComponent implements OnInit, OnDestroy {
  user: UserProfile;
  userAddresses: Address[];
  destroy$ = new Subject();
  editUserInfo: boolean = false;
  editUserAddress: boolean = false;
  addUserAddress: boolean = false;
  userInfoForm: FormGroup;
  useraddressForm: FormGroup;
  districts: any[];
  id: number;
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private districtsService: DistrictsService,
    private dialogService: DialogService,
    private store: AppStore
  ) {}

  ngOnInit() {
    this.userService
      .getUserProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe((userProfile: UserProfile) => {
        this.user = userProfile;
        this.userInfoForm.controls["name"].setValue(this.user.name);
        this.userInfoForm.controls["mobile"].setValue(this.user.phone);
      });
    this.userService
      .getUserAddresses()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (userAddresses: Address[]) => {
          this.userAddresses = userAddresses;
          // this.store.addresses$.next(this.userAddresses);
        },
        err => {
          // this.store.addresses$.next([]);
          console.log("error from get addresses::", err);
          if (!err.error.message)
            this.dialogService.openDialog({
              msg: err.message
            });
        }
      );
    // Build Register Form.
    this.userInfoForm = this.fb.group(
      {
        name: [
          "",
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(40),
            Validators.pattern("[a-zA-Z ]*")
          ]
        ],
        mobile: [
          "",
          [
            Validators.required,
            Validators.minLength(11),
            Validators.maxLength(15),
            Validators.pattern("^[0-9]*$")
          ]
        ]
        // lastName: [
        //   "",
        //   [
        //     Validators.required,
        //     Validators.minLength(3),
        //     Validators.maxLength(40),
        //     Validators.pattern("[a-zA-Z ]*")
        //   ]
        // ],
        // password: ["", [Validators.required, Validators.minLength(8)]],
        // confirmPassword: ["", [Validators.required, Validators.minLength(8)]]
      }
      // {
      //   validator: MustMatch("password", "confirmPassword")
      // }
    );
    this.useraddressForm = this.fb.group({
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
        [
          Validators.required,
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
    // this.useraddressForm.reset();
    // this.userInfoForm.reset();
    // GET all districts
    this.districtsService.getAllDistricts().subscribe((districts: any) => {
      this.districts = districts;
    });
  }
  ngOnDestroy() {
    this.destroy$.next(false);
    this.destroy$.complete();
  }
  editInfo(event) {
    this.editUserInfo = true;
  }
  editAddressInfo(event, id) {
    this.editUserAddress = true;
    this.addUserAddress = false;
    this.id = id;
    const address = this.userAddresses.find(obj => obj.address_id == this.id);
    console.log(address);
    this.useraddressForm.controls["city"].setValue(address.city);
    this.useraddressForm.controls["street"].setValue(address.street);
    this.useraddressForm.controls["nearest_landmark"].setValue(
      address.nearest_landmark
    );
    this.useraddressForm.controls["district_id"].setValue(address.district_id);
    this.useraddressForm.controls["apartment_no"].setValue(
      address.apartment_no
    );
    this.useraddressForm.controls["floor_no"].setValue(address.floor_no);
    this.useraddressForm.controls["building_no"].setValue(address.building_no);
    // console.log(this.id);
  }
  get infof() {
    return this.userInfoForm.controls;
  }
  get addressf() {
    return this.useraddressForm.controls;
  }
  addNewAddress() {
    this.addUserAddress = true;
    this.editUserAddress = false;
  }
  editUserProfile(event) {
    if (this.userInfoForm.valid) {
      console.log(this.userInfoForm.value);
      let name = this.userInfoForm.get("name").value;
      // " " +
      // this.userInfoForm.get("lastName").value;
      // console.log(name);
      let phone = this.userInfoForm.get("mobile").value;
      this.userService
        .editUser({ name, phone })
        .subscribe((res: UserProfile) => {
          console.log(res);
          this.user = res;
          this.editUserInfo = false;
        });
    }
  }
  editUserAddressInfo() {
    console.log(this.id);
    if (this.editUserAddress) {
      if (this.useraddressForm.valid) {
        console.log(this.useraddressForm.value);
        this.userService
          .editUserAddress(this.id, this.useraddressForm.value)
          .subscribe((res: Address[]) => {
            this.userAddresses = res;
            // this.store.addresses$.next(res);
          });
        this.editUserAddress = false;
        this.addUserAddress = false;
      }
    } else if (this.addUserAddress) {
      if (this.useraddressForm.valid) {
        console.log(this.useraddressForm.value);
        this.userService
          .addUserAddress(this.useraddressForm.value)
          .subscribe((res: Address[]) => {
            this.userAddresses = res;
            // this.store.addresses$.next(res);
          });
        this.editUserAddress = false;
        this.addUserAddress = false;
      }
    }
  }
  cancelInfoEdit() {
    this.editUserInfo = false;
    this.userInfoForm.controls["name"].setValue(this.user.name);
    this.userInfoForm.controls["mobile"].setValue(this.user.phone);
  }
  cancelAddressEdit() {
    this.editUserAddress = false;
    this.addUserAddress = false;
    // this.useraddressForm.reset();
  }
  deleteUserAddress(event, id) {
    this.userService.deleteUserAddress(id).subscribe(
      (response: any) => {
        let address = this.userAddresses.find((item: any) => item.id == id);
        this.userAddresses.splice(0, this.userAddresses.indexOf(address));
        this.store.addresses$.next(this.userAddresses);
        if (response) {
          this.userService.getUserAddresses().subscribe(res => {
            this.userAddresses = res;
          });
        }
      },
      error => {}
    );
  }
}
