import { Injectable } from "@angular/core";

import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class HttpOptionsService {
  private apiUrl = environment.base_url;
  constructor(private _httpClient: HttpClient) { }

  getAllCategories(
    page = 0,
    $search = "",
    limit = 10
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append("page", page.toString());
    params = params.append("limit", limit.toString());
    params = params.append("name", $search.toString());
    params = params.append("pagination", "true");
    return this._httpClient.get(`${this.apiUrl}categories`, {
      params: params,
      observe: "response"
    });
  }


  getOptionOfCategory(categoryId, page = 0,
    $search = "",
    limit = 10) {
    let params = new HttpParams();
    params = params.append("page", page.toString());
    params = params.append("limit", limit.toString());
    params = params.append("name", $search.toString());
    params = params.append("pagination", "true");
    return this._httpClient.get<any>(`${this.apiUrl}categories/${categoryId}/options`, {
      params: params,
      observe: 'response'
    });
  }
  // accept to send reject or accept status
  sendNewCategory(body, categoryId) {
    return this._httpClient.post(`${this.apiUrl}categories/${categoryId}/options`, body, {
      observe: "response"
    });
  }

  updateOption(body, categoryId, optionId) {
    return this._httpClient.put(`${this.apiUrl}categories/${categoryId}/options/${optionId}`, body, {
      observe: "response"
    });
  }

  deleteOptionForCategory(categoryId, optionId) {
    return this._httpClient.delete(`${this.apiUrl}categories/${categoryId}/options/${optionId}`, {
      observe: "response"
    });
  }

}
