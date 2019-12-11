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
import { OptionsDataSource } from './class/options.datasource.';
import { CategoriesDataSource } from '../categories/class/categories.datasource';
import { HttpOptionsService } from './service/httpOptionService.service';
import { AddNewOptionComponent } from './components/add-new-options/add-new-options.component';
import { UpdateOptionsComponent } from './components/update-options/update-options.component';
import { HttpCategoriesService } from '../categories/service/categories.service';

@Component({
  selector: "app-options",
  templateUrl: "./options.component.html",
  styleUrls: [
    "./options.component.scss",
    "../../modules/tabel.scss"
  ]
})
export class OptionsComponent implements OnInit {
  displayedColumns: string[] = [
    "position",
    "name",
    "created_at",
    "updated_at",
    "Actions"
  ];
  dataSource = new CategoriesDataSource(this.categoryService);
  dataSourceCategoryItems = new OptionsDataSource(this.httpOptionService)
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
    private httpOptionService: HttpOptionsService,
    private changeDetectorRefs: ChangeDetectorRef,
    private categoryService: HttpCategoriesService,
    private notificationService: NotificationService,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.refreshServicesData();
  }

  refreshServicesData() {
    this.noCities = false;
    this.dataSource = new CategoriesDataSource(this.categoryService);
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
    this.dataSourceCategoryItems = new OptionsDataSource(this.httpOptionService);
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


  addNewCategoryItem() {
    if (!this.selectedCategory) {
      this.notificationService.warningNotification('Please select category first');
      return;
    }
    const dialogRef = this.dialogRef.open(AddNewOptionComponent, {
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



  updateCategoryItems(element) {
    const dialogRef = this.dialogRef.open(UpdateOptionsComponent, {
      maxWidth: "60%",
      width: "60%",
      data: {
        item: element,
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



  deleteOptionForCateogry(element) {
    console.log('option id', element._id);
    console.log('category id', this.selectedCategory._id);
    this.httpOptionService.deleteOptionForCategory(this.selectedCategory._id, element._id).subscribe(
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
