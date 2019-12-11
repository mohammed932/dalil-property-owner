import { Component, OnInit } from "@angular/core";
import { HttpSettingsService } from "./services/settings.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NotificationService } from "../../shared/services/notifications/notification.service";
import { AuthService } from "../auth/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent implements OnInit {
  cities: any;
  submitted = false;
  success = false;
  isDisabled = false;
  loading = false;

  userData: any;
  constructor(
    private fg: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notifcationService: NotificationService
  ) {}

  public userDataForm = this.fg.group({
    name: ["", Validators.required],
    mobile: ["", Validators.required],
    account_number: ["", Validators.required],
    email: ["", Validators.compose([Validators.required, Validators.email])],
    city: ["", Validators.required]
  });

  get f() {
    return this.userDataForm["controls"];
  }

  ngOnInit() {
    this.authService.getUserData().subscribe(data => {
      console.log(data);
      if (data.status === 200) {
        this.userData = data.body;
        this.setFormData(this.userData);
      }
    });
    this.authService.getCitiesFromApi().subscribe(data => {
      if (data.status === 200) {
        this.cities = data.body;
      }
    });
  }

  setFormData(userData) {
    this.userDataForm["controls"].name.setValue(userData.name);
    this.userDataForm["controls"].mobile.setValue(userData.mobile);
    this.userDataForm["controls"].city.setValue(userData.city || "");
    this.userDataForm["controls"].email.setValue(userData.email || "");
    this.userDataForm["controls"].account_number.setValue(
      userData.account_number || ""
    );
  }

  updateData() {
    this.submitted = true;
    this.isDisabled = true;
    this.loading = true;
    console.log(this.userDataForm.value);
    this.userDataForm.value.mobile = this.userDataForm.value.mobile;
    if (this.userDataForm.invalid) {
      this.notifcationService.errorNotification("من فضلك راجع البيانات");
      this.isDisabled = false;
      this.loading = false;
      return;
    }
    this.authService.registerUpdate(this.userDataForm.value).subscribe(
      data => {
        if (data.status === 200) {
          this.notifcationService.successNotification("تم التسجيل بنجاح");
          this.success = true;
          this.isDisabled = false;
          this.loading = false;
          this.setFormData(data["body"]);
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
