import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { HttpResponse } from "@angular/common/http";
import { NotificationService } from "../../../shared/services/notifications/notification.service";

@Component({
  selector: "app-verfiy-code",
  templateUrl: "./verfiy-code.component.html",
  styleUrls: ["./verfiy-code.component.scss", "../login/login.component.scss"]
})
export class VerfiyCodeComponent implements OnInit {
  counter = 30;
  interval = 1000;
  loading: boolean = false;
  loadingResend: boolean = false;
  value;
  userData = JSON.parse(localStorage.getItem("userData"));
  constructor(
    private fg: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notifcationService: NotificationService
  ) {}

  public verifyCodeForm = this.fg.group({
    mobile: ["", Validators.required]
  });

  ngOnInit() {
    this.verifyCodeForm["controls"].mobile.setValue(this.userData.mobile_token);
  }

  requiredErrorMessage($feild) {
    return this.verifyCodeForm["controls"][$feild].hasError("required")
      ? "You must enter a value"
      : "";
  }

  resendCode() {
    const userMobileNumber = this.authService.getUserPhoneNumber();
    let userCredentials = {
      mobile: userMobileNumber,
      type: "property_owner"
    };
    if (!this.loadingResend) {
      this.loadingResend = true;
      this.authService.login(userCredentials).subscribe(
        (resp: HttpResponse<any>) => {
          if (resp.status === 200) {
            this.authService.saveUserId(resp.body.id);
            this.loadingResend = false;
          }
        },
        err => {
          this.loadingResend = false;
          this.notifcationService.errorNotification(err.error.message);
        }
      );
    }
  }

  verifyCode() {
    const data = {
      mobile_token: this.verifyCodeForm["controls"].mobile.value,
      userId: localStorage.getItem("USER_ID")
    };
    this.isValidCode(data);
  }

  isValidCode(data) {
    const userData = {
      user: data.userId,
      mobile_token: parseInt(data.mobile_token)
    };

    if (this.verifyCodeForm.invalid) {
      this.notifcationService.errorNotification(
        "Please make you entered valid code"
      );
      return;
    }

    this.authService.varifyCode(userData).subscribe(
      resp => {
        if (resp.status === 200) {
          this.counter = 30;
          this.authService.saveToken(resp.body.token);
          this.authService.saveUserData(resp.body);
          this.router.navigate([""]);
        }
      },
      err => {
        this.notifcationService.errorNotification(err.error.message);
      }
    );
  }
}
