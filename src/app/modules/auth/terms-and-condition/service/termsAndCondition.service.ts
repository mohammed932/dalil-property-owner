import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Injectable({
    providedIn: "root"
})
export class TermsAndConditionService {
    private baseUrl: string = environment.base_url;
    constructor(
        private httpClient: HttpClient
    ) { }

    getTermsAndConditions() {
        return this.httpClient.get(`${this.baseUrl}configurations`, {
            observe: 'response',
        });
    }

}