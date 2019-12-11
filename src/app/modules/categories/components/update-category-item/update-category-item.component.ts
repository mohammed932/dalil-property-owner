import { Component, OnInit, Inject, AfterViewInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { NotificationService } from "../../../../shared/services/notifications/notification.service";
import { HttpCategoriesService } from "../../service/categories.service";
@Component({
  selector: "app-update-category-item",
  templateUrl: "./update-category-item.component.html",
  styleUrls: [
    "./update-category-item.component.scss",
    "../add-new-category-item/add-new-category-item.component.scss"
  ]
})
export class UpdateCategoryItemComponent implements OnInit, AfterViewInit {
  public pipe = new DatePipe("en-US");
  public updateCategoryItem: FormGroup;
  loading = false;
  displayIogo = false;
  displayLogoActive = false;
  logo: any;
  logo_active: any;

  logoData: any;
  active_logo_Data: any;

  center: any = {
    lat: 30.044281,
    lng: 31.340002
  };
  drawingPaths: any;
  cityPaths = [];

  constructor(
    private fg: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private dialogRef: MatDialog,
    private notificationService: NotificationService,
    private httpCategoryService: HttpCategoriesService
  ) {}

  ngOnInit() {
    this.updateCategoryItem = this.fg.group({
      name: ["", Validators.required]
    });
    this.setCategoryName();
    this.checkIfHasLogos();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    if (!file) {
      return;
    }
    const mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
      return this.notificationService.errorNotification(
        "This file is not supported, please upload image"
      );
    }
    this.logoData = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.logo = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onActiveLogoImgPicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    if (!file) {
      return;
    }
    const mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
      return this.notificationService.errorNotification(
        "This file is not supported, please upload image"
      );
    }
    this.active_logo_Data = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.logo_active = reader.result;
    };
    reader.readAsDataURL(file);
  }

  // append the image and backround to formData
  appendImagesToProduct(formData, productData) {
    if (this.logoData) {
      formData.append("logo", this.logoData);
    }
    if (this.active_logo_Data) {
      formData.append("logo_active", this.active_logo_Data);
    }
    formData.append("data", JSON.stringify(productData));
  }

  setCategoryName() {
    this.updateCategoryItem["controls"].name.setValue(this.data.items.name);
  }

  checkIfHasLogos() {
    if (this.data.items.logo) {
      this.displayIogo = true;
      this.logo = this.data.items.logo;
    }

    if (this.data.items.logo_active) {
      this.displayLogoActive = true;
      this.logo_active = this.data.items.logo_active;
    }
  }

  sendUpdatedCategory() {
    const data = {
      name: this.updateCategoryItem["controls"].name.value
    };
    const formData = new FormData();
    this.appendImagesToProduct(formData, data);

    this.httpCategoryService
      .updateCategoryItems(
        formData,
        this.data.category._id,
        this.data.items._id
      )
      .subscribe(
        data => {
          if (data.status === 200) {
            this.notificationService.successNotification(
              `Category ${data.body["name"]} created`
            );
            this.dialogRef.closeAll();
          }
        },
        err => {
          this.notificationService.errorNotification(err.error.message);
        }
      );
  }

  ngAfterViewInit() {}
}
