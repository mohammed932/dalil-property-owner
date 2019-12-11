import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { AuthService } from "../../../../auth/services/auth.service";
import { NotificationService } from "../../../../../shared/services/notifications/notification.service";
import { HttpUsersServices } from "../../../services/httpUsersServices";

@Component({
  selector: "app-add-new-admin",
  templateUrl: "./add-new-admin.component.html",
  styleUrls: ["./add-new-admin.component.scss"]
})
export class AddNewAdminComponent implements OnInit {
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
      name: ["", Validators.required]
    });
  }

  onSubmit() {
    this.loading = true;
    const adminData = {
      mobile: this.createNewUser["controls"].mobile.value,
      name: this.createNewUser["controls"].name.value,
      type: "admin"
    };
    if (this.createNewUser.invalid) {
      this.loading = false;
      return this.notificationService.errorNotification(
        "Please enter correct data!"
      );
    }

    this.httpUsersService.createUsers(adminData).subscribe(
      data => {
        if (data.status === 200) {
          this.notificationService.successNotification(
            "Admin has been Created"
          );
          this.mdRef.closeAll();
        }
      },
      err => {
        this.loading = false;
        this.notificationService.errorNotification(err.error.message);
      }
    );
  }
}
