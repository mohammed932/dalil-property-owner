import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { NotificationService } from "../../../../shared/services/notifications/notification.service";
import { HttpCategoriesService } from "../../service/categories.service";
@Component({
  selector: "app-update-category",
  templateUrl: "./update-category.component.html",
  styleUrls: ["./update-category.component.scss"]
})
export class UpdateCategoryComponent implements OnInit {
  public pipe = new DatePipe("en-US");
  public updateCategory: FormGroup;
  loading = false;
  center: any = {
    lat: 30.044281,
    lng: 31.340002
  };
  drawingPaths: any;
  cityPaths = [];
  imagePreview: any;
  image: File;

  constructor(
    private fg: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public category: any,
    private toastr: ToastrService,
    // private httpAreasService: HttpAreasService,
    private dialogRef: MatDialog,
    private notificationSerive: NotificationService,
    private httpCategoryService: HttpCategoriesService
  ) {}

  ngOnInit() {
    console.log(this.category);
    this.updateCategory = this.fg.group({
      name: ["", Validators.required],
      name_ar: ["", Validators.required],
      app_percentage: ["", Validators.required]
    });
    this.setCategoryName();
  }

  setCategoryName() {
    this.updateCategory["controls"].name.setValue(this.category.name);
    this.updateCategory["controls"].name_ar.setValue(
      this.category.translation.ar.name
    );
    this.updateCategory["controls"].app_percentage.setValue(
      this.category.app_percentage
    );

    this.imagePreview = this.category.image;
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    if (!file) {
      return;
    }
    const mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
      return this.notificationSerive.errorNotification(
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

  appendImage(formData, data) {
    formData.append("image", this.image);
    formData.append("data", JSON.stringify(data));
    return formData;
  }

  sendUpdatedCategory() {
    const data = {
      name: this.updateCategory["controls"].name.value,
      tag: this.category.tag,
      app_percentage: this.updateCategory["controls"].app_percentage.value,
      translation: {
        ar: {
          name: this.updateCategory["controls"].name_ar.value
        }
      }
    };
    const formData = new FormData();
    this.appendImage(formData, data);

    this.httpCategoryService
      .updateCategory(formData, this.category._id)
      .subscribe(
        data => {
          if (data.status === 200) {
            this.notificationSerive.successNotification(
              `تم تعديل ${data.body["name"]} بنجاح`
            );
            this.dialogRef.closeAll();
          }
        },
        err => {
          this.notificationSerive.errorNotification(err.error.message);
        }
      );
  }
}
