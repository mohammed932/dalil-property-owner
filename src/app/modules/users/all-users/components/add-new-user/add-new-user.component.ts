import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { AuthService } from "../../../../../modules/auth/services/auth.service";
import { NotificationService } from "../../../../../shared/services/notifications/notification.service";
import { HttpUsersServices } from "../../../services/httpUsersServices";

@Component({
  selector: "app-add-new-user",
  templateUrl: "./add-new-user.component.html",
  styleUrls: ["./add-new-user.component.scss"]
})
export class AddNewUserComponent implements OnInit {
  createNewUser: FormGroup;
  isFormValid = false;
  loading = false;
  center: any = {
    lat: 30.044281,
    lng: 31.340002
  };
  locationValues = [];

  constructor(
    private fg: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private httpUsersService: HttpUsersServices,
    @Inject(MAT_DIALOG_DATA) public city: any,
    private mdRef: MatDialog
  ) {}

  ngOnInit() {
    this.createNewUser = this.fg.group({
      mobile: ["", Validators.required],
      name: ["", Validators.required],
      customer_type: ["", Validators.required]
    });
  }

  onSubmit() {
    const body = {
      mobile: this.createNewUser["controls"].mobile.value,
      name: this.createNewUser["controls"].name.value,
      type: this.createNewUser["controls"].customer_type.value
    };
    if (this.createNewUser.invalid) {
      return this.notificationService.errorNotification(
        "Please enter correct data!"
      );
    }

    this.httpUsersService.createUsers(body).subscribe(
      data => {
        if (data.status === 200) {
          this.notificationService.successNotification(
            "Operator has been created"
          );
          this.mdRef.closeAll();
        }
      },
      err => {
        this.notificationService.errorNotification(err.error.message);
      }
    );
  }
}
