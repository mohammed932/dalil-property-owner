import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, Subject, of } from "rxjs";
import { catchError, finalize, first, map, filter, tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpActivitiesService } from '../service/activities.service';

@Injectable({
  providedIn: "root"
})
export class ActivitiesDataSource implements DataSource<any> {
  public dataSubjectActivities = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private metaSubject = new BehaviorSubject<any>({});
  public mata$ = this.metaSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public activitiesData$ = this.dataSubjectActivities.asObservable();
  empty = false;

  constructor(private httpActivitieService: HttpActivitiesService) { }

  connect(): Observable<any[]> {
    return this.dataSubjectActivities.pipe(
      tap(data => {
        this.empty = !data.length;
      })
    );
  }

  disconnect(): void {
    this.dataSubjectActivities.complete();
    this.loadingSubject.complete();
  }
  loadCategories$($pageNumber, $search) {
    this.loadingSubject.next(true);
    this.httpActivitieService
      .getAllActivities($pageNumber, $search)
      .pipe(
        first(),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(data => {
        console.log(data);
        this.dataSubjectActivities.next(data.body.properties);
        this.metaSubject.next(data.body.length);
      });
  }
}
