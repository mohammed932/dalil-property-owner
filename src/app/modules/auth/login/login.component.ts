import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpResponse } from "@angular/common/http";
import { AuthService } from "../services/auth.service";
import { NotificationService } from "../../../shared/services/notifications/notification.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  loading: boolean = false;
  userData = {};

  constructor(
    private fg: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notifcationService: NotificationService
  ) {}

  public loginForm = this.fg.group({
    mobile: ["", Validators.required]
  });

  ngOnInit() {}

  requiredErrorMessage($feild) {
    return this.loginForm["controls"][$feild].hasError("required")
      ? "You must enter a value"
      : "";
  }

  goToRegister() {
    this.router.navigateByUrl(
      `${localStorage.getItem("LOCALIZE_DEFAULT_LANGUAGE")}/auth/register`
    );
  }

  login() {
    const mobileNumber = this.loginForm["controls"].mobile.value.toString();
    let userCredentials = {
      mobile: mobileNumber,
      type: "customer"
    };
    console.log(mobileNumber.charAt(0));
    if (mobileNumber.charAt(0) !== "+") {
      this.notifcationService.errorNotification(
        "Please enter (+) before the phone number"
      );
      return;
    }
    if (this.loginForm.invalid) {
      this.notifcationService.errorNotification(
        "Please Enter Valid Phone Number"
      );
      return;
    }
    if (this.loginForm.valid && !this.loading) {
      this.loading = true;
      this.authService.login(userCredentials).subscribe(
        (resp: HttpResponse<any>) => {
          if (resp.status === 200) {
            this.authService.saveUserPhoneNumber(mobileNumber);
            //save user id
            this.authService.saveUserId(resp.body.id);
            //just for development
            this.authService.saveUserData(resp.body);
            this.authService.saveToken(resp.body.token);
            this.router.navigateByUrl(
              `${localStorage.getItem(
                "LOCALIZE_DEFAULT_LANGUAGE"
              )}/auth/verify-user`
            );
          }
        },
        err => {
          this.loading = false;
          this.notifcationService.errorNotification(err.error.message);
        }
      );
    }
  }

  setUserDataToLocalStorage(userData) {
    localStorage.setItem("user", JSON.stringify(userData["id"]));
  }
}
