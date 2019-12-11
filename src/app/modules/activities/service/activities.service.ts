import { Injectable } from "@angular/core";

import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class HttpActivitiesService {
  private apiUrl = environment.base_url;
  constructor(private _httpClient: HttpClient) { }

  getAllActivities(
    page = 0,
    $search = "",
    limit = 10
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append("page", page.toString());
    params = params.append("limit", limit.toString());
    params = params.append("name", $search.toString());
    params = params.append("pagination", "true");
    return this._httpClient.get(`${this.apiUrl}propertyOwner/${localStorage.getItem('USER_ID')}/properties`, {
      params: params,
      observe: "response"
    });
  }

  closeSpecifcDateForActivity(date, propertyId) {
    const body = {
      date: date
    }
    return this._httpClient.post(`${this.apiUrl}properties/${propertyId}/close`, body, {
      observe: 'response'
    })
  }


  getAllReservation(
    page = 0,
    $search = "",
    propertyId,
    limit = 10
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append("page", page.toString());
    params = params.append("limit", limit.toString());
    params = params.append("booking_number", $search.toString());
    params = params.append("pagination", "true");
    return this._httpClient.get(`${this.apiUrl}properties/${propertyId}/users/${localStorage.getItem('USER_ID')}/bookings`, {
      params: params,
      observe: "response"
    });
  }

  getSingleReservation(propertyId, bookingId) {
    return this._httpClient.get(`${this.apiUrl}properties/${propertyId}/users/${localStorage.getItem('USER_ID')}/bookings/${bookingId}`, {
      observe: "response"
    });
  }

  // accept to send reject or accept status
  sendNewOccation(body) {
    return this._httpClient.post(`${this.apiUrl}occasions`, body, {
      observe: "response"
    });
  }

  sendPaymentStatusPropertyOwner(body, propertyId, bookingId) {
    return this._httpClient.put(`${this.apiUrl}properties/${propertyId}/users/${localStorage.getItem('USER_ID')}/bookings/${bookingId}`, body, {
      observe: "response"
    });
  }

  sendNewOffer = (offer) => {
    return this._httpClient.post(`${this.apiUrl}offers`, offer, {
      observe: "response"
    });
  }

  updateOccasion(body, occasionId) {
    return this._httpClient.put(`${this.apiUrl}occasions/${occasionId}`, body, {
      observe: "response"
    });
  }


  deleteActivity(activityId) {
    return this._httpClient.delete(`${this.apiUrl}properties/${activityId}`, {
      observe: "response"
    });
  }

}
