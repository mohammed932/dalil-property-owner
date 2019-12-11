// import { CollectionViewer, DataSource } from "@angular/cdk/collections";
// import { Observable, BehaviorSubject, Subject, of } from "rxjs";
// import { catchError, finalize, first, map, filter, tap } from "rxjs/operators";
// import { Injectable } from "@angular/core";
// import { HttpConfigurationsService } from '../services/configurations.service';

// @Injectable({
//     providedIn: 'root'
// })
// export class ConfigurationsDataSource implements DataSource<any> {
//     public dataSubjectClipperServices = new BehaviorSubject<any[]>([]);
//     private loadingSubject = new BehaviorSubject<boolean>(false);
//     private metaSubject = new BehaviorSubject<any>({});
//     public mata$ = this.metaSubject.asObservable();
//     public loading$ = this.loadingSubject.asObservable();
//     public clipperServicesSubjectData = this.dataSubjectClipperServices.asObservable();
//     empty = false;

//     constructor(private httpClipperServices: HttpConfigurationsService) { }

//     connect(): Observable<any[]> {
//         return this.dataSubjectClipperServices.pipe(
//             tap(data => {
//                 this.empty = !data.length;
//                 console.log(this.empty , !data.length);
//             })
//         );
//     }

//     disconnect(): void {
//         this.dataSubjectClipperServices.complete();
//         this.loadingSubject.complete();
//     }
//     loadClipperServices$($pageNumber, $search) {
//         this.loadingSubject.next(true);
//         this.httpClipperServices
//             .getAllClipperServicesFromApi($pageNumber, $search)
//             .pipe(
//                 first(),
//                 catchError(() => of([])),
//                 finalize(() => this.loadingSubject.next(false))
//             )
//             .subscribe(data => {
//                 console.log(data);
//                 this.dataSubjectClipperServices.next(data.body.categories);
//                 this.metaSubject.next(data.body.length);
//             });
//     }
//     clipperServiceDataSubject$() {
//         return this.dataSubjectClipperServices.asObservable();
//     }

//     isServiceEmpty$() {
//         return this.dataSubjectClipperServices.pipe(
//             filter(data => data.length < 1)
//         );
//     }

// }
