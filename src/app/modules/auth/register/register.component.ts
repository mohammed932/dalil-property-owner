import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { NotificationService } from "../../../shared/services/notifications/notification.service";
import { Location } from "@angular/common";
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  cities: any;
  submitted = false;
  checked = false;
  success = false;
  isDisabled = true;
  loading = false;
  constructor(
    private fg: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private notifcationService: NotificationService
  ) {}

  public registerForm = this.fg.group({
    name: ["", Validators.required],
    mobile: ["", Validators.required],
    account_number: ["", Validators.required],
    email: ["", Validators.compose([Validators.required, Validators.email])],
    city: ["", Validators.required]
  });

  get f() {
    return this.registerForm["controls"];
  }
  checkedPrivacyPolicy(event) {
    console.log(event);
    this.isDisabled = event.source.checked;
  }
  ngOnInit() {
    this.authService.publicCities().subscribe(data => {
      if (data.status === 200) {
        this.cities = data.body;
      }
    });
  }

  goToTerms() {
    this.router.navigateByUrl(
      `${localStorage.getItem("LOCALIZE_DEFAULT_LANGUAGE")}/auth/terms`
    );
  }

  register() {
    this.submitted = true;
    this.isDisabled = true;
    this.loading = true;
    console.log(this.registerForm.value);
    this.registerForm.value.mobile = "+966" + this.registerForm.value.mobile;
    if (this.registerForm.invalid) {
      this.notifcationService.errorNotification("من فضلك راجع البيانات");
      this.isDisabled = false;
      this.loading = false;
      return;
    }
    this.authService.register(this.registerForm.value).subscribe(
      data => {
        if (data.status === 200) {
          this.notifcationService.successNotification("تم التسجيل بنجاح");
          this.success = true;
          this.isDisabled = false;
          this.loading = false;
          this.location.back();
          this.registerForm.reset();
          this.submitted = false;
        }
      },
      err => {
        this.notifcationService.errorNotification(err.error.message);
        this.isDisabled = false;
        this.loading = false;
      }
    );
  }
}
