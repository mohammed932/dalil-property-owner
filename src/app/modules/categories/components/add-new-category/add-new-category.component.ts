import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { NotificationService } from "../../../../shared/services/notifications/notification.service";
import { HttpCategoriesService } from "../../service/categories.service";
@Component({
  selector: "app-add-new-category",
  templateUrl: "./add-new-category.component.html",
  styleUrls: ["./add-new-category.component.scss"]
})
export class AddNewCategoryComponent implements OnInit {
  tags = [
    {
      id: 1,
      name: "شاليهات",
      value: "شاليهات"
    },
    {
      id: 2,
      name: "قاعات اعمال",
      value: "قاعات_اعمال"
    },
    {
      id: 3,
      name: "استراحات",
      value: "استراحات"
    },
    {
      id: 4,
      name: "قاعات افراح",
      value: "قاعات_افراح"
    },
    {
      id: 5,
      name: "خدمات خاصة",
      value: "خدمات_خاصة"
    },
    {
      id: 6,
      name: "ضيافة",
      value: "ضيافة"
    },
    {
      id: 7,
      name: "مخيمات",
      value: "مخيمات"
    }
  ];
  isDisabled = false;
  public pipe = new DatePipe("en-US");
  public createNewCategory: FormGroup;
  image: any;

  loading = false;
  center: any = {
    lat: 30.044281,
    lng: 31.340002
  };
  drawingPaths: any;
  cityPaths = [];
  imagePreview: any;

  constructor(
    private fg: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public city: any,
    private toastr: ToastrService,
    // private httpAreasService: HttpAreasService,
    private dialogRef: MatDialog,
    private notificationService: NotificationService,
    private httpCategoryService: HttpCategoriesService
  ) {}

  ngOnInit() {
    this.createNewCategory = this.fg.group({
      name: ["", Validators.required],
      name_ar: ["", Validators.required],
      app_percentage: ["", Validators.required],
      tag: ["", Validators.required]
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

  appendImage(formData, data) {
    formData.append("image", this.image);
    formData.append("data", JSON.stringify(data));
    return formData;
  }

  saveNewCategory() {
    this.isDisabled = true;
    const data = {
      name: this.createNewCategory["controls"].name.value,
      tag: this.createNewCategory["controls"].tag.value,
      app_percentage: this.createNewCategory["controls"].app_percentage.value,
      translation: {
        ar: {
          name: this.createNewCategory["controls"].name_ar.value
        }
      }
    };

    const formData = new FormData();
    this.appendImage(formData, data);

    this.httpCategoryService.sendNewCategory(formData).subscribe(
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
        this.notificationService.errorNotification(err.error.message);
        this.isDisabled = false;
      }
    );
  }
}
