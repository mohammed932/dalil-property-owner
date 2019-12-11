import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable, BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class HttpProductService {
  private apiUrl = environment.base_url;

  constructor(private _httpClient: HttpClient) { }

  getCategories(): Observable<any> {
    return this._httpClient.get(`${this.apiUrl}categories`, {
      observe: "response"
    });
  }

  getCategoryItems(categoryId) {
    return this._httpClient.get(`${this.apiUrl}categories/${categoryId}/items`, {
      observe: "response"
    });
  }




  sendProductData(body) {
    const headers = new HttpHeaders();
    headers.append("Content-Type", "multipart/form-data");
    return this._httpClient.post(`${this.apiUrl}products`, body, {
      headers: headers,
      observe: "response"
    });
  }

  updateConfigurations(body): Observable<any> {
    const headers = new HttpHeaders();
    if (body.hasOwnProperty("images")) {
      headers.append("Content-Type", "multipart/form-data");
      return this._httpClient.put(`${this.apiUrl}configurations`, body, {
        headers: headers,
        observe: "response"
      });
    }
    return this._httpClient.put(`${this.apiUrl}configurations`, body, {
      observe: "response"
    });
  }
}
