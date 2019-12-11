import { Component, OnInit } from "@angular/core";
import { LanguageService } from "./shared/services/language/language.service";
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  constructor(
    private languageService: LanguageService,
    private translate: TranslateService
    ) { 
      translate.setDefaultLang('ar');
      translate.use('ar');
    }
  ngOnInit() {
    this.languageService.initAppUrl();
  }
}
