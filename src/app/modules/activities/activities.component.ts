import {
  Component,
  OnInit,
  Optional,
  ElementRef,
  ViewChild,
  ChangeDetectorRef
} from "@angular/core";
import {
  map,
  distinctUntilChanged,
  debounceTime,
  tap,
  takeUntil
} from "rxjs/operators";
import { MatDialog, MatPaginator } from "@angular/material";
import { fromEvent } from "rxjs/internal/observable/fromEvent";
import { Subject } from "rxjs";
import { NotificationService } from "../../shared/services/notifications/notification.service";
import { TranslateService } from "@ngx-translate/core";
import { ActivitiesDataSource } from "./class/activities.datasource";
import { AddNewActivitiesComponent } from "./components/add-new-activities/add-new-activities.component";
import { HttpActivitiesService } from "./service/activities.service";
import { Router } from "@angular/router";
import { AddOfferActivityComponent } from "./components/add-offer/add-offer-activities.component";
import { ReservationDataSource } from "./class/reservation.dataSource";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-activities",
  templateUrl: "./activities.component.html",
  styleUrls: [
    "./activities.component.scss",
    "../../modules/configurations/components/chalets/chalets.component.scss",
    "../../modules/tabel.scss"
  ]
})
export class ActivitiesComponent implements OnInit {
  displayedColumns: string[] = [
    "position",
    "name",
    "is_offer",
    "category",
    "city",
    "price",
    "price_after_offer",
    "reservationDate",
    "actions"
  ];

  displayedColumnsReservations: string[] = [
    "position",
    "name",
    "customer_name",
    "customer_mobile",
    "date",
    "booking_number",
    "down_payment",
    "will_pay",
    "app_money",
    "property_price",
    "status",
    "complete_payment"
  ];
  dataSource = new ActivitiesDataSource(this.httpActivityService);
  dataSourceReservation = new ReservationDataSource(this.httpActivityService);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  $destroy = new Subject<any>();
  noData = false;
  loading = false;
  totalCitiesNumber: number;
  totalActivities: number;
  userData = JSON.parse(localStorage.getItem("userData"));
  reset = "";
  status = "";
  selectedRow: any;
  selectedCategory: any;
  @ViewChild("searchInput") search: ElementRef;
  @ViewChild("searchInputCategoryItem") searchCategoryItem: ElementRef;
  @ViewChild("reservationPignator") reservationPaginator: MatPaginator;

  noActivities: boolean;
  selectedActivity: any;
  isDisabled: boolean = false;
  dialogWidth: string;
  constructor(
    @Optional() public dialogRef: MatDialog,
    private httpActivityService: HttpActivitiesService,
    private changeDetectorRefs: ChangeDetectorRef,
    private notificationService: NotificationService,
    public translate: TranslateService,
    private router: Router,
    private datepipe: DatePipe,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.refreshServicesData();

    this.breakpointObserver
      .observe(["(max-width: 800px)"])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.dialogWidth = "85%";
        } else {
          this.dialogWidth = "60%";
        }
      });
  }

  refreshServicesData() {
    this.noActivities = false;
    this.dataSource = new ActivitiesDataSource(this.httpActivityService);
    this.dataSource.loadCategories$(0, this.search.nativeElement.value);
    this.dataSource.mata$
      .pipe(takeUntil(this.$destroy))
      .subscribe(totalNumber => (this.totalActivities = totalNumber));
    this.changeDetectorRefs.detectChanges();
  }

  getSelectedProperty(property) {
    console.log("entered");
    this.dataSourceReservation = new ReservationDataSource(
      this.httpActivityService
    );
    this.selectedActivity = property;
    this.dataSourceReservation.loadReservations$(
      property._id,
      0,
      this.searchCategoryItem.nativeElement.value
    );
    this.dataSource.mata$
      .pipe(takeUntil(this.$destroy))
      .subscribe(totalNumber => (this.totalCitiesNumber = totalNumber));
    this.changeDetectorRefs.detectChanges();
  }

  addNewActivity() {
    this.router.navigateByUrl(
      `${localStorage.getItem("LOCALIZE_DEFAULT_LANGUAGE")}/configurations`
    );
  }

  caluclateWillPay(element) {
    let down_payment;
    if (!element.property.is_offer) {
      let x = element.property.category.down_payment_percentage / 100;
      down_payment = element.property.price - element.property.price * x;
    } else {
      let x = element.property.category.down_payment_percentage / 100;
      down_payment =
        element.property.offer_price - element.property.offer_price * x;
    }
    return down_payment;
  }
  caluclateDownPayment(element) {
    let down_payment;
    let x = element.property.category.down_payment_percentage / 100;
    if (!element.property.is_offer) {
      down_payment = element.property.price * x;
    } else {
      down_payment = element.property.offer_price * x;
    }
    console.log(down_payment);

    return down_payment;
  }

  calculateAppPercentage(element) {
    let appPercentage;
    if (element.is_offer) {
      appPercentage =
        (element.property.offer_price *
          element.property.category.app_percentage) /
        100;
    } else {
      appPercentage =
        (element.property.price * element.property.category.app_percentage) /
        100;
    }
    return appPercentage;
  }

  updateCategory(element) {
    this.router.navigate(["activities", element._id]);
  }

  openOfferDialog(element) {
    const dialogRef = this.dialogRef.open(AddOfferActivityComponent, {
      maxWidth: this.dialogWidth,
      width: this.dialogWidth,
      data: element
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.refreshServicesData();
      });
  }

  onDate(event, element) {
    let selectedDate = this.formatDate(event);
    this.httpActivityService
      .closeSpecifcDateForActivity(selectedDate, element._id)
      .subscribe(
        data => {
          if (data.status === 200) {
            this.refreshServicesData();
            this.notificationService.successNotification(
              `تم حجز النشاط بتاريخ ${selectedDate}`
            );
          }
        },
        err => {
          this.notificationService.errorNotification(err.error.message);
        }
      );
  }
  formatDate(selectedDate) {
    const currentDate = new Date(selectedDate);
    let latest_date = this.datepipe.transform(currentDate, "yyyy-MM-dd");
    return latest_date || "";
  }

  disableDays(dates) {
    let formatedDates = [];
    for (let index = 0; index < dates.length; index++) {
      const currentDate = new Date(dates[index]);
      const element = this.datepipe.transform(currentDate, "yyyy-MM-dd");
      formatedDates.push(new Date(element));
    }
    return formatedDates;
  }

  deleteCategory(element) {
    this.httpActivityService.deleteActivity(element._id).subscribe(
      data => {
        if (data.status === 200) {
          this.notificationService.successNotification(
            `${data.body["message"]}`
          );
          this.refreshServicesData();
        }
      },
      err => {
        this.notificationService.errorNotification(err.error.message);
      }
    );
  }

  getSelectedActivity(activity) {
    this.selectedActivity = activity;
  }

  getActivationStatus(status) {
    this.status = status.value;
    this.loadPage(this.status);
  }
  ngAfterViewInit() {
    this.paginator.page
      .pipe(tap(() => this.loadPage(this.paginator.pageIndex)))
      .subscribe();
    this.reservationPaginator.page
      .pipe(
        tap(() => this.loadPageReservation(this.reservationPaginator.pageIndex))
      )
      .subscribe();
    fromEvent(this.search.nativeElement, "keyup")
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadPage(this.paginator.pageIndex);
        })
      )
      .subscribe();

    fromEvent(this.searchCategoryItem.nativeElement, "keyup")
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.loadPageReservation(this.reservationPaginator.pageIndex);
        })
      )
      .subscribe();
  }
  // pignate the Activitهes pages
  loadPage(pageIndex) {
    this.dataSource.loadCategories$(pageIndex, this.search.nativeElement.value);
  }

  completePayment(element) {
    element.isLoading = true;
    element.isDisabled = true;
    this.loading = true;
    this.isDisabled = true;
    const body = {
      status: "completed"
    };
    this.httpActivityService
      .sendPaymentStatusPropertyOwner(body, element.property._id, element._id)
      .subscribe(
        data => {
          if (data.status === 200) {
            this.notificationService.successNotification(
              "تم تحصيل المبلغ بالكامل"
            );
            element.isDisabled = false;
            element.isLoading = false;
            this.loadPageReservation(this.reservationPaginator.pageIndex);
          }
        },
        err => {
          element.isDisabled = false;
          element.isLoading = false;
          this.notificationService.errorNotification(err.error.message);
        }
      );
  }

  loadPageReservation(pageIndex) {
    this.dataSourceReservation.loadReservations$(
      this.selectedActivity._id,
      pageIndex,
      this.searchCategoryItem.nativeElement.value
    );
  }

  clearSelection() {
    this.reset = null;
    this.status = "";
    this.loadPage(this.status);
  }

  /*
   destroy the $destroy subject to unsubscribe from all the observable subscribtion
  */
  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
