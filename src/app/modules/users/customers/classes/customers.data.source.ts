import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, Subject, of } from "rxjs";
import { catchError, finalize, first, map, filter, tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpUsersServices } from '../../services/httpUsersServices';

@Injectable({
    providedIn: 'root'
})
export class CustomersDataSource implements DataSource<any> {
    public customersDataSubject = new BehaviorSubject<any[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private metaSubject = new BehaviorSubject<any>({});
    public mata$ = this.metaSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();
    public clipperServicesSubjectData = this.customersDataSubject.asObservable();
    empty = false;

    constructor(private httpUsersService: HttpUsersServices) { }

    connect(): Observable<any[]> {
        return this.customersDataSubject.pipe(
            tap(data => {
                this.empty = !data.length;
            })
        );
    }

    disconnect(): void {
        this.customersDataSubject.complete();
        this.loadingSubject.complete();
    }
    loadUsers($pageNumber, $search, role) {
        this.loadingSubject.next(true);
        this.httpUsersService
            .getUsersByRoles($pageNumber, $search, role)
            .pipe(
                first(),
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(data => {
                this.customersDataSubject.next(data.body.users);
                this.metaSubject.next(data.body.length);
            });
    }
    clipperServiceDataSubject$() {
        return this.customersDataSubject.asObservable();
    }

    isServiceEmpty$() {
        return this.customersDataSubject.pipe(
            filter(data => data.length < 1)
        );
    }

}
