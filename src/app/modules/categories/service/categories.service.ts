import { Injectable } from "@angular/core";

import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class HttpCategoriesService {
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


  getCategoryItems(categoryId, page = 0,
    $search = "",
    limit = 10) {
    let params = new HttpParams();
    params = params.append("page", page.toString());
    params = params.append("limit", limit.toString());
    params = params.append("name", $search.toString());
    params = params.append("pagination", "true");
    return this._httpClient.get<any>(`${this.apiUrl}categories/${categoryId}/subCategories`, {
      params: params,
      observe: 'response'
    });
  }
  // accept to send reject or accept status
  sendNewCategory(body) {
    const headers = new HttpHeaders();
    headers.append("Content-Type", "multipart/form-data");
    return this._httpClient.post(`${this.apiUrl}categories`, body, {
      headers: headers,
      observe: "response"
    });
  }

  updateCategory(body, categoryId) {
    const headers = new HttpHeaders();
    headers.append("Content-Type", "multipart/form-data");
    return this._httpClient.put(`${this.apiUrl}categories/${categoryId}`, body, {
      headers: headers,
      observe: "response"
    });
  }

  updateCategoryItems(body, categoryId, itemId) {
    return this._httpClient.put(`${this.apiUrl}categories/${categoryId}/items/${itemId}`, body, {
      observe: "response"
    });
  }

  sendNewCategoryItem(body, categoryId) {
    const headers = new HttpHeaders();
    headers.append("Content-Type", "multipart/form-data");
    return this._httpClient.post(`${this.apiUrl}categories/${categoryId}/subCategories
    `, body, {
        headers: headers,
        observe: "response"
      });
  }

  deleteCategory(categoryId) {
    return this._httpClient.delete(`${this.apiUrl}categories/${categoryId}`, {
      observe: "response"
    });
  }

  deleteCategoryItem(categoryId, itemId) {
    return this._httpClient.delete(`${this.apiUrl}categories/${categoryId}/items/${itemId}`, {
      observe: "response"
    });
  }

}
