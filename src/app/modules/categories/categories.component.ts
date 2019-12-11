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
import { CategoriesDataSource } from './class/categories.datasource';
import { HttpCategoriesService } from './service/categories.service';
import { AddNewCategoryComponent } from './components/add-new-category/add-new-category.component';
import { CategoryItemsDataSource } from './class/category-items.datasource.';
import { AddNewCategoryItemComponent } from './components/add-new-category-item/add-new-category-item.component';
import { UpdateCategoryComponent } from './components/update-category/update-category.component';
import { UpdateCategoryItemComponent } from './components/update-category-item/update-category-item.component';

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: [
    "./categories.component.scss",
    "../../modules/tabel.scss"
  ]
})
export class CategoriesComponent implements OnInit {
  displayedColumns: string[] = [
    "position",
    "name",
    "created_at",
    "updated_at",
    "Actions"
  ];
  displayedColumsReservation: string[] = [
    "position",
    "name",
    "Actions"
  ]
  dataSource = new CategoriesDataSource(this.httpCategoryService);
  dataSourceCategoryItems = new CategoryItemsDataSource(this.httpCategoryService)
  @ViewChild(MatPaginator) paginator: MatPaginator;
  $destroy = new Subject<any>();
  noData = false;
  loading = false;
  noCities = false;
  noAreas = false;
  totalCitiesNumber: number;
  totalAreasNumber: number;
  reset = "";
  status = "";

  selectedCategory: any;
  noClipperServices = this.dataSource
    .clipperServiceDataSubject$()
    .pipe(map(data => data.length === 0));
  @ViewChild("searchInput") search: ElementRef;
  @ViewChild("searchInputCategoryItem") searchCategoryItem: ElementRef;
  constructor(
    @Optional() public dialogRef: MatDialog,
    private httpCategoryService: HttpCategoriesService,
    private changeDetectorRefs: ChangeDetectorRef,
    private notificationService: NotificationService,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.refreshServicesData();
  }

  refreshServicesData() {
    this.noCities = false;
    this.dataSource = new CategoriesDataSource(this.httpCategoryService);
    this.dataSource.loadCategories$(
      0,
      this.search.nativeElement.value,
      this.status
    );
    this.dataSource.mata$
      .pipe(takeUntil(this.$destroy))
      .subscribe(totalNumber => (this.totalCitiesNumber = totalNumber));
    this.changeDetectorRefs.detectChanges();
  }

  getSelectedCategoryItems(categoryId) {
    this.dataSourceCategoryItems = new CategoryItemsDataSource(this.httpCategoryService);
    this.dataSourceCategoryItems.loadCategoriesItems$(
      categoryId,
      0,
      this.searchCategoryItem.nativeElement.value,
    );
    this.dataSource.mata$
      .pipe(takeUntil(this.$destroy))
      .subscribe(totalNumber => (this.totalCitiesNumber = totalNumber));
    this.changeDetectorRefs.detectChanges();
  }

  addNewCategory() {
    const dialogRef = this.dialogRef.open(AddNewCategoryComponent, {
      maxWidth: "60%",
      width: "60%",
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.refreshServicesData();
      });
  }



  addNewCategoryItem() {
    if (!this.selectedCategory) {
      this.notificationService.warningNotification('Please select category first');
      return;
    }
    const dialogRef = this.dialogRef.open(AddNewCategoryItemComponent, {
      maxWidth: "60%",
      width: "60%",
      data: this.selectedCategory
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.getSelectedCategoryItems(this.selectedCategory._id);
      });
  }

  updateCategory(element) {
    const dialogRef = this.dialogRef.open(UpdateCategoryComponent, {
      maxWidth: "60%",
      width: "60%",
      data: element
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.refreshServicesData();
      });
  }


  updateCategoryItems(element) {
    const dialogRef = this.dialogRef.open(UpdateCategoryItemComponent, {
      maxWidth: "60%",
      width: "60%",
      data: {
        items: element,
        category: this.selectedCategory
      }
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.getSelectedCategoryItems(this.selectedCategory._id);
      });
  }


  deleteCategory(element) {
    this.httpCategoryService.deleteCategory(element._id).subscribe(
      data => {
        if (data.status === 200) {
          this.notificationService.successNotification(
            `${data.body['message']}`
          );
          this.refreshServicesData();
        }
      },
      err => {
        this.notificationService.errorNotification(err.error.message);
      }
    );
  }

  deleteCategoryItem(element) {
    this.httpCategoryService.deleteCategoryItem(this.selectedCategory._id, element._id).subscribe(
      data => {
        if (data.status === 200) {
          this.notificationService.successNotification(
            `${data.body['message']}`
          );
          this.getSelectedCategoryItems(this.selectedCategory._id);
        }
      },
      err => {
        this.notificationService.errorNotification(err.error.message);
      }
    );
  }

  getSelectedCategory(category) {
    this.selectedCategory = category;
    this.getSelectedCategoryItems(category._id)
  }

  getActivationStatus(status) {
    this.status = status.value;
    this.loadPage(this.status);
  }
  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.loadPage(this.status))).subscribe();
    fromEvent(this.search.nativeElement, "keyup")
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadPage(this.status);
        })
      )
      .subscribe();


    fromEvent(this.searchCategoryItem.nativeElement, "keyup")
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.getSelectedCategoryItems(this.selectedCategory._id);
        })
      )
      .subscribe();
  }
  // pignate the Cities pages
  loadPage(status = "") {
    this.dataSource.loadCategories$(
      this.paginator.pageIndex,
      this.search.nativeElement.value,
      status
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
