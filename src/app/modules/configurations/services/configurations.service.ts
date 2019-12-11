import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class HttpActivityService {
  base_url = environment.base_url;
  constructor(private _httpClient: HttpClient) { }

  getAllCities() {
    return this._httpClient.get(`${this.base_url}cities`, {
      observe: 'response'
    })
  }

  getSingleActivity(activityId, state) {
    state = true;
    return this._httpClient.get<any>(`${this.base_url}properties/${activityId}`, {
      observe: 'response'
    });
  }

  getCityAreas(cityId) {
    return this._httpClient.get(`${this.base_url}cities/${cityId}/areas`, {
      observe: 'response'
    })
  }

  deleteImageFromApi(propertyId, imageType, url) {
    let params = new HttpParams();
    params = params.append('url', url);
    return this._httpClient.delete(`${this.base_url}properties/${propertyId}/${imageType}`, {
      params: params,
      observe: 'response'
    })
  }

  getCategories() {
    return this._httpClient.get(`${this.base_url}categories`, {
      observe: 'response'
    })
  }

  getOccasions() {
    return this._httpClient.get(`${this.base_url}occasions`)
  }
  getSubCategories(categoryId) {
    let params = new HttpParams();
    params = params.append("pagination", "false");
    return this._httpClient.get<any>(`${this.base_url}categories/${categoryId}/subCategories`, {
      params: params,
      observe: 'response'
    });
  }

  createProperty(body) {
    const headers = new HttpHeaders();
    headers.append("Content-Type", "multipart/form-data");
    return this._httpClient.post(`${this.base_url}properties`, body, {
      headers: headers,
      observe: 'response',
    })
  }

  updateProperty(body, propertyId) {
    const headers = new HttpHeaders();
    headers.append("Content-Type", "multipart/form-data");
    return this._httpClient.put(`${this.base_url}properties/${propertyId}`, body, {
      headers: headers,
      observe: 'response',
    })
  }

  getOptionForCategory(categoryId) {
    let params = new HttpParams();
    params = params.append("pagination", "false");
    return this._httpClient.get<any>(`${this.base_url}categories/${categoryId}/options`, {
      params: params,
      observe: 'response'
    });
  }
}
