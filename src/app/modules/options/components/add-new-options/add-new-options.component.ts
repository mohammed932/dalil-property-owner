import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { NotificationService } from "../../../../shared/services/notifications/notification.service";
import { HttpOptionsService } from "../../service/httpOptionService.service";

@Component({
  selector: "app-add-new-options",
  templateUrl: "./add-new-options.component.html",
  styleUrls: ["./add-new-options.component.scss"]
})
export class AddNewOptionComponent implements OnInit {
  tags = [
    {
      id: 1,
      name: "شاليهات",
      value: "شاليهات"
    },
    {
      id: 2,
      name: "قاعات",
      value: "قاعات"
    },
    {
      id: 3,
      name: "استراحات",
      value: "استرحات"
    },
    {
      id: 4,
      name: "قاعات افراح",
      value: "قاعات_افراح"
    },
    {
      id: 5,
      name: "خدمات خاصة",
      value: "خدمات_حاصة"
    },
    {
      id: 6,
      name: "ضيافة",
      value: "ضيافة"
    },
    {
      id: 7,
      name: "عروض",
      value: "مخيمات"
    }
  ];
  isDisabled = false;
  public pipe = new DatePipe("en-US");
  public createNewOption: FormGroup;
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
    @Inject(MAT_DIALOG_DATA) public option: any,
    private toastr: ToastrService,
    // private httpAreasService: HttpAreasService,
    private dialogRef: MatDialog,
    private notificationService: NotificationService,
    private httpOptionService: HttpOptionsService
  ) {}

  ngOnInit() {
    console.log(this.option);
    this.createNewOption = this.fg.group({
      name: ["", Validators.required],
      name_ar: ["", Validators.required]
    });
  }

  saveNewOption() {
    this.isDisabled = true;
    const data = {
      name: this.createNewOption["controls"].name.value,
      translation: {
        ar: {
          name: this.createNewOption["controls"].name_ar.value
        }
      }
    };
    this.httpOptionService.sendNewCategory(data, this.option._id).subscribe(
      data => {
        if (data.status === 200) {
          this.isDisabled = false;
          this.notificationService.successNotification(
            `تم اضافة الخيار ${data.body["name"]}`
          );
          this.dialogRef.closeAll();
        }
      },
      err => {
        this.isDisabled = false;
        this.notificationService.errorNotification(err.error.message);
      }
    );
  }
}
