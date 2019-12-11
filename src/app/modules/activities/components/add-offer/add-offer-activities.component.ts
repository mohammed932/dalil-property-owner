import { Component, OnInit, Inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { NotificationService } from "../../../../shared/services/notifications/notification.service";
import { HttpActivitiesService } from "../../service/activities.service";

@Component({
  selector: "app-add-offer",
  templateUrl: "./add-offer-activities.component.html",
  styleUrls: ["./add-offer-activities.component.scss"]
})
export class AddOfferActivityComponent implements OnInit {
  public pipe = new DatePipe("en-US");
  public createNewOffer: FormGroup;
  isDisabled = false;
  loading = false;
  center: any = {
    lat: 30.044281,
    lng: 31.340002
  };
  drawingPaths: any;
  cityPaths = [];
  startOffer: string;
  endOffer: string;

  constructor(
    private fg: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public activity: any,
    private toastr: ToastrService,
    private dialogRef: MatDialog,
    private notificationService: NotificationService,
    private httpOccationService: HttpActivitiesService,
    private datepipe: DatePipe
  ) {}
  dateStart = new FormControl(new Date());
  dateEnd = new FormControl(new Date());
  ngOnInit() {
    console.log(this.activity);
    this.createNewOffer = this.fg.group({
      price: ["", Validators.required]
    });
    if (this.activity.is_offer) {
      this.dateStart = new FormControl(new Date(this.activity.offer_start));
      this.dateEnd = new FormControl(new Date(this.activity.offer_end));
      this.createNewOffer["controls"].price.setValue(this.activity.offer_price);
    }
  }

  getStartOfferDate(event) {
    const START_OFFER_TIME = new Date(event.target.value);
    const startDate =
      START_OFFER_TIME.getFullYear() +
      "-" +
      (START_OFFER_TIME.getMonth() + 1) +
      "-" +
      START_OFFER_TIME.getDate();
    this.startOffer = this.formatDate(startDate);
  }

  getEndOfferDate(event) {
    const END_OFFER_TIME = new Date(event.target.value);
    this.endOffer = this.formatDate(END_OFFER_TIME);
    console.log("endOffer :", this.endOffer);
  }

  formatDate(selectedDate) {
    const currentDate = selectedDate;
    let latest_date = this.datepipe.transform(currentDate, "yyyy-MM-dd");
    return latest_date || "";
  }

  saveNewOffer() {
    console.log("mooooooooo");
    this.isDisabled = true;
    this.loading = true;
    console.log(this.activity);

    if (this.createNewOffer["controls"].price.invalid) {
      this.notificationService.errorNotification("من فضلك ادخل السعر");
      this.isDisabled = false;
      this.loading = false;
      return;
    }

    const offerData = {
      property: this.activity._id,
      offer_price: this.createNewOffer["controls"].price.value,
      offer_start: this.formatDate(this.dateStart.value),
      offer_end: this.formatDate(this.dateEnd.value)
    };
    console.log("offerData :", offerData);
    this.httpOccationService.sendNewOffer(offerData).subscribe(
      data => {
        if (data.status === 200) {
          this.isDisabled = false;
          this.loading = false;
          this.notificationService.successNotification(
            `تم اضافة عرض لنشاط ${data.body["name"]}`
          );
          this.dialogRef.closeAll();
        }
      },
      err => {
        this.isDisabled = false;
        this.loading = false;
        this.notificationService.errorNotification(err.error.message);
      }
    );
  }
}
