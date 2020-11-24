import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
interface DialogData {
  msg: string;
  confirmButtons: boolean;
  loginButtons: boolean;
  justOk: boolean;
}

@Component({
  selector: "app-login-dialog",
  templateUrl: "./login-dialog.component.html",
  styleUrls: ["./login-dialog.component.scss"]
})
export class LoginDialogComponent implements OnInit {
  message;
  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.data && this.data.message) {
      this.message = this.data.message;
    }
  }

  openLoginDialog() {
    let modal = document.getElementById("LoginModel"),
      modalTrigger = document.querySelector(".LoginButton");

    (modalTrigger as HTMLElement).click();
    console.log("login modal ::", modal, "trigger ::", modalTrigger);
  }
}
