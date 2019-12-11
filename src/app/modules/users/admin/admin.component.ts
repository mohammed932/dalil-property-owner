import {
  Component,
  OnInit,
  Optional,
  ChangeDetectorRef,
  Inject,
  ViewChild,
  OnDestroy,
  AfterViewInit,
  ElementRef
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  map,
  takeUntil,
  tap,
  debounceTime,
  distinctUntilChanged,
  filter,
  mergeMap
} from "rxjs/operators";
import { Subject } from "rxjs/internal/Subject";
import { fromEvent, Subscription } from "rxjs";
import { AdminDataSource } from "./classes/admin.data.source";
import { NotificationService } from "../../../shared/services/notifications/notification.service";
import { HttpUsersServices } from "../services/httpUsersServices";
import { MatPaginator, MatDialog } from "@angular/material";
import { AddNewAdminComponent } from "./components/add-new-admin/add-new-admin.component";
@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: [
    "./admin.component.scss",
    "../../../modules/tabel.scss"
  ]
})
export class AdminComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = [
    "position",
    "name",
    "mobile",
    "role",
    "Actions"
  ];
  dataSource = new AdminDataSource(this.httpUsersServices);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  $destroy = new Subject<any>();
  noData = false;
  loading = false;
  noCities = false;
  noAreas = false;
  totalCitiesNumber: number;
  totalAreasNumber: number;
  role = "admin";
  sub: Subscription;
  noClipperServices = this.dataSource
    .clipperServiceDataSubject$()
    .pipe(map(data => data.length === 0));
  @ViewChild("searchInput") search: ElementRef;
  constructor(
    @Optional() public dialogRef: MatDialog,
    private httpUsersServices: HttpUsersServices,
    private changeDetectorRefs: ChangeDetectorRef,
    private notificationService: NotificationService,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    this.refreshServicesData();
  }

  refreshServicesData() {
    this.noCities = false;
    this.dataSource = new AdminDataSource(this.httpUsersServices);
    this.dataSource.loadUsers(0, this.search.nativeElement.value, this.role);
    this.dataSource.mata$
      .pipe(takeUntil(this.$destroy))
      .subscribe(totalNumber => (this.totalCitiesNumber = totalNumber));
    this.changeDetectorRefs.detectChanges();
  }

  addNewAdmin = (): void => {
    const dialogRef = this.dialogRef.open(AddNewAdminComponent, {
      maxWidth: "60%",
      width: "60%"
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.refreshServicesData();
      });
  };

  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.loadPage())).subscribe();

    fromEvent(this.search.nativeElement, "keyup")
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadPage();
        })
      )
      .subscribe();
  }
  // pignate the Cities pages
  loadPage() {
    this.dataSource.loadUsers(
      this.paginator.pageIndex,
      this.search.nativeElement.value,
      this.role
    );
  }

  /*
   destroy the $destroy subject to unsubscribe from all the observable subscribtion
  */
  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
    this.changeDetectorRefs.detach();
  }

  deleteAdmin(element) {
    this.httpUsersServices.deleteUsers(element._id).subscribe(
      data => {
        if (data.status === 200) {
          this.notificationService.successNotification(
            "Admin has been deleted"
          );
          this.refreshServicesData();
        }
      },
      err => {
        this.notificationService.errorNotification(err.error.message);
      }
    );
  }
}
