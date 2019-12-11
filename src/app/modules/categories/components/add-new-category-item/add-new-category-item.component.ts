import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { NotificationService } from "../../../../shared/services/notifications/notification.service";
import { HttpCategoriesService } from "../../service/categories.service";
@Component({
  selector: "app-add-new-category-item",
  templateUrl: "./add-new-category-item.component.html",
  styleUrls: ["./add-new-category-item.component.scss"]
})
export class AddNewCategoryItemComponent implements OnInit {
  isDisabled = false;
  public pipe = new DatePipe("en-US");
  public createNewCategoryItem: FormGroup;
  loading = false;
  center: any = {
    lat: 30.044281,
    lng: 31.340002
  };
  drawingPaths: any;
  cityPaths = [];
  image: any;
  active_logo: any;
  imagePreview: any;
  imagePreviewActiveLogo: any;
  constructor(
    private fg: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public categoryData: any,
    private toastr: ToastrService,
    // private httpAreasService: HttpAreasService,
    private dialogRef: MatDialog,
    private notificationService: NotificationService,
    private httpCategoryService: HttpCategoriesService
  ) {}

  ngOnInit() {
    this.createNewCategoryItem = this.fg.group({
      name: ["", Validators.required],
      name_ar: ["", Validators.required]
    });
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
    this.image = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
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
    this.active_logo = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewActiveLogo = reader.result;
    };
    reader.readAsDataURL(file);
  }

  // append the image and backround to formData
  appendImagesToProduct(formData, productData) {
    formData.append("image", this.image);
    formData.append("data", JSON.stringify(productData));
  }

  saveNewCategoryItem() {
    this.isDisabled = true;
    const data = {
      name: this.createNewCategoryItem["controls"].name.value,
      translation: {
        ar: {
          name: this.createNewCategoryItem["controls"].name_ar.value
        }
      }
    };

    const formData = new FormData();
    this.appendImagesToProduct(formData, data);

    this.httpCategoryService
      .sendNewCategoryItem(formData, this.categoryData._id)
      .subscribe(
        data => {
          if (data.status === 200) {
            this.notificationService.successNotification(
              `Category ${data.body["name"]} created`
            );
            this.dialogRef.closeAll();
            this.isDisabled = false;
          }
        },
        err => {
          this.isDisabled = false;
          this.notificationService.errorNotification(err.error.message);
        }
      );
  }
}
