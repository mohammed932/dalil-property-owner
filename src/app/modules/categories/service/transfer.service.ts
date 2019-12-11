import { Injectable } from "@angular/core";

import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class TransferService {
  private apiUrl = environment.base_url;
  constructor(private _httpClient: HttpClient) {}

  getAllTransfersMoney(
    page = 0,
    $search = "",
    status = "",
    limit = 10
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append("page", page.toString());
    params = params.append("limit", limit.toString());
    params = params.append("transfer_name", $search.toString());
    params = params.append("status", status.toString());
    params = params.append("pagination", "true");
    return this._httpClient.get(`${this.apiUrl}transfers`, {
      params: params,
      observe: "response"
    });
  }
  // accept to send reject or accept status
  sendTransferStauts(body, transferId) {
    return this._httpClient.put(`${this.apiUrl}transfers/${transferId}`, body, {
      observe: "response"
    });
  }
}
