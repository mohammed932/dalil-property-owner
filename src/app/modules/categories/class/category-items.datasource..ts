import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, Subject, of } from "rxjs";
import { catchError, finalize, first, map, filter, tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpCategoriesService } from '../service/categories.service';

@Injectable({
  providedIn: "root"
})
export class CategoryItemsDataSource implements DataSource<any> {
  public dataSubjectCategoriesItems = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private metaSubject = new BehaviorSubject<any>({});
  public mata$ = this.metaSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public categoriesData$ = this.dataSubjectCategoriesItems.asObservable();
  empty = false;

  constructor(private httpCategoriesService: HttpCategoriesService) { }

  connect(): Observable<any[]> {
    return this.dataSubjectCategoriesItems.pipe(
      tap(data => {
        this.empty = !data.length;
      })
    );
  }

  disconnect(): void {
    this.dataSubjectCategoriesItems.complete();
    this.loadingSubject.complete();
  }
  loadCategoriesItems$(categoryId, $pageNumber, $search) {
    this.loadingSubject.next(true);
    this.httpCategoriesService
      .getCategoryItems(categoryId, $pageNumber, $search)
      .pipe(
        first(),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(data => {
        this.dataSubjectCategoriesItems.next(data['body'].subcategories);
        this.metaSubject.next(data['body'].length);
      });
  }
  clipperServiceDataSubject$() {
    return this.dataSubjectCategoriesItems.asObservable();
  }

  isServiceEmpty$() {
    return this.dataSubjectCategoriesItems.pipe(
      filter(data => data.length < 1)
    );
  }
}
