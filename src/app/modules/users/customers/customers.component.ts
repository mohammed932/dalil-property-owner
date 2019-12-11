import { Component, OnInit, Optional, ChangeDetectorRef, ViewChild, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map, takeUntil, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { fromEvent, Subscription } from 'rxjs';
import { HttpUsersServices } from '../services/httpUsersServices';
import { MatPaginator, MatDialog } from '@angular/material';
import { CustomersDataSource } from './classes/customers.data.source';
import { NotificationService } from '../../../shared/services/notifications/notification.service';
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss', '../../../modules/tabel.scss']
})

export class CustomersComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'mobile', 'role', 'status', 'Actions'];
  dataSource = new CustomersDataSource(this.httpUsersServices);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  $destroy = new Subject<any>();
  noData = false;
  loading = false;
  noCities = false;
  noAreas = false;
  totalCitiesNumber: number;
  totalAreasNumber: number;
  role = 'property_owner';
  sub: Subscription;
  noClipperServices = this.dataSource.clipperServiceDataSubject$().pipe(
    map(data => data.length === 0));
  @ViewChild('searchInput') search: ElementRef;
  constructor(
    @Optional() public dialogRef: MatDialog,
    private httpUsersServices: HttpUsersServices,
    private changeDetectorRefs: ChangeDetectorRef,
    public translate: TranslateService,
    private notficationService: NotificationService
  ) { }

  ngOnInit() {
    this.refreshServicesData();
  }

  refreshServicesData() {
    this.noCities = false;
    this.dataSource = new CustomersDataSource(this.httpUsersServices);
    this.dataSource.loadUsers(0, this.search.nativeElement.value, this.role);
    this.dataSource.mata$.pipe(
      takeUntil(this.$destroy)
    ).subscribe(totalNumber => this.totalCitiesNumber = totalNumber);
    this.changeDetectorRefs.detectChanges();
  }


  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.loadPage())).subscribe();

    fromEvent(this.search.nativeElement, 'keyup')
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

  verifyPropertyOwner(propertyId, status) {
    const body = {
      is_verified: status
    };
    this.httpUsersServices.verifyPropertyOwner(propertyId, body).subscribe(data => {
      if (data.status === 200) {

        if (status === 'true') {
          this.notficationService.successNotification('تم تفعيل الحساب');
        }
        if (status === 'false') {
          this.notficationService.errorNotification('تم وقف الحساب');
        }
        this.refreshServicesData();
      }
    }, err => {
      this.notficationService.errorNotification(err.error.message);
    })
  }


}
