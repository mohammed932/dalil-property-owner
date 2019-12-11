import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, Subject, of } from "rxjs";
import { catchError, finalize, first, map, filter, tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpCategoriesService } from '../service/categories.service';

@Injectable({
  providedIn: "root"
})
export class CategoriesDataSource implements DataSource<any> {
  public dataSubjectCategories = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private metaSubject = new BehaviorSubject<any>({});
  public mata$ = this.metaSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public categoriesData$ = this.dataSubjectCategories.asObservable();
  empty = false;

  constructor(private HttpCategoryService: HttpCategoriesService) { }

  connect(): Observable<any[]> {
    return this.dataSubjectCategories.pipe(
      tap(data => {
        this.empty = !data.length;
      })
    );
  }

  disconnect(): void {
    this.dataSubjectCategories.complete();
    this.loadingSubject.complete();
  }
  loadCategories$($pageNumber, $search, status) {
    this.loadingSubject.next(true);
    this.HttpCategoryService
      .getAllCategories($pageNumber, $search, status)
      .pipe(
        first(),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(data => {
        this.dataSubjectCategories.next(data.body.categories);
        this.metaSubject.next(data.body.length);
      });
  }
  clipperServiceDataSubject$() {
    return this.dataSubjectCategories.asObservable();
  }

  isServiceEmpty$() {
    return this.dataSubjectCategories.pipe(
      filter(data => data.length < 1)
    );
  }
}
