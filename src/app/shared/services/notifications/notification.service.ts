import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LanguageService } from '../language/language.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private toastr: ToastrService,
    private languageService: LanguageService
  ) { }

  successNotification(message): void {
    this.toastr.success(`<b>${message}</b>`, '', {
      timeOut: 8000,
      closeButton: true,
      enableHtml: true,
      toastClass: "alert alert-success alert-with-icon",
      positionClass: 'toast-' + 'top' + '-' + 'right'
    });
  }

  warningNotification(message): void {
    this.toastr.warning(`${message}`, '', {
      timeOut: 8000,
      closeButton: true,
      enableHtml: true,
      toastClass: "alert alert-warning alert-with-icon",
      positionClass: 'toast-' + 'top' + '-' + 'right'
    });
  }

  errorNotification(message): void {
    this.toastr.error(`<b>${message}</b>`, '', {
      timeOut: 8000,
      closeButton: true,
      enableHtml: true,
      toastClass: "alert alert-danger alert-with-icon",
      positionClass: 'toast-' + 'top' + '-' + `right`
    });
  }

}
