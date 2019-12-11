import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { User } from "../modals/user";

@Injectable({
  providedIn: "root"
})
export class HttpUsersServices {
  private apiUrl = environment.base_url;
  constructor(private _httpClient: HttpClient) { }

  getUsersByRoles(
    page = 0,
    $search = "",
    $role = "",
    is_active = "",
    is_verified = "",
    limit = 10
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append("page", page.toString());
    params = params.append("limit", limit.toString());
    params = params.append("mobile", $search);
    params = params.append("role", $role);
    params = params.append("pagination", "true");
    // params = params.append("is_active", is_active.toString());
    // params = params.append("is_verified", is_verified);

    return this._httpClient.get(`${this.apiUrl}users`, {
      params: params,
      observe: "response"
    });
  }

  getAdmins(page = 0, $search = "", $role = "", limit = 10): Observable<any> {
    let params = new HttpParams();
    params = params.append("page", page.toString());
    params = params.append("limit", limit.toString());
    params = params.append("name", $search);
    params = params.append("role", $role);
    params = params.append("pagination", "true");
    return this._httpClient.get(`${this.apiUrl}users`, {
      params: params,
      observe: "response"
    });
  }

  verfiyEmployee(employeId, body) {
    return this._httpClient.put(`${this.apiUrl}users/${employeId}`, body, {
      observe: "response"
    });
  }
  verifyPropertyOwner(propertyOwner, body) {
    return this._httpClient.put(`${this.apiUrl}users/${propertyOwner}`, body, {
      observe: "response"
    });
  }
  getSingleUser(userId): Observable<User> {
    return this._httpClient.get<User>(`${this.apiUrl}users/${userId}`);
  }

  createUsers(body) {
    return this._httpClient.post(`${this.apiUrl}users/create`, body, {
      observe: "response"
    });
  }

  deleteUsers(id) {
    return this._httpClient.delete(`${this.apiUrl}users/${id}`, {
      observe: 'response'
    });
  }
}
