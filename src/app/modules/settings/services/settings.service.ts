import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class HttpSettingsService {
  private apiUrl = environment.base_url;
  constructor(
    private httpClient: HttpClient
  ) { }

  getSettings() {
    return this.httpClient.get(`${this.apiUrl}configuration`, {
      observe: 'response'
    })
  }

  updateSettings(body) {
    return this.httpClient.put(`${this.apiUrl}configuration`, body, {
      observe: 'response'
    })
  }
}
