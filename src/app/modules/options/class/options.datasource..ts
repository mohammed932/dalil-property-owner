import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, Subject, of } from "rxjs";
import { catchError, finalize, first, map, filter, tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpOptionsService } from '../service/httpOptionService.service';

@Injectable({
  providedIn: "root"
})
export class OptionsDataSource implements DataSource<any> {
  public dataSubjectCategoriesItems = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private metaSubject = new BehaviorSubject<any>({});
  public mata$ = this.metaSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public categoriesData$ = this.dataSubjectCategoriesItems.asObservable();
  empty = false;

  constructor(private httpOptionService: HttpOptionsService) { }

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
    this.httpOptionService
      .getOptionOfCategory(categoryId, $pageNumber, $search)
      .pipe(
        first(),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(data => {
        console.log(data);
        this.dataSubjectCategoriesItems.next(data['body'].options);
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
