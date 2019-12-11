import { Injectable } from "@angular/core";
import { LocalizeRouterService } from "localize-router";
import { TranslateService } from "@ngx-translate/core";
import { Subject, Observable } from "rxjs";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/internal/operators/filter";
import { Location } from "@angular/common";
@Injectable({
  providedIn: "root"
})
export class LanguageService {
  public isEnglishLang = "";
  lastLocale = "";
  localSubject = new Subject();
  constructor(
    private localizeRouterService: LocalizeRouterService,
    private translateService: TranslateService,
    private _router: Router,
    private location: Location
  ) { }

  changeAppLanguage(local: string) {
    this.lastLocale = local;
    this.setAppLocalizations(local);
    this.changeAppDirection(local);
  }

  changeAppDirection(local) {
    return local !== "ar"
      ? document.getElementsByTagName("html")[0].setAttribute("dir", "ltr")
      : document.getElementsByTagName("html")[0].setAttribute("dir", "rtl");
  }
  setAppLocalizations(lang: string) {
    this.translateService.setDefaultLang(lang);
    this.translateService.use(lang);
    this.localizeRouterService.changeLanguage(lang);
  }

  initAppUrl() {
    const token = localStorage.getItem("dalelTokenPropertyOwner");
    const currentLanaguage = localStorage.getItem("LOCALIZE_DEFAULT_LANGUAGE");
    const availableLanguages = ["ar"];
    const urlLang = this.location.path().split("/")[1];

    if (!token) {
      this._router.navigateByUrl(`${currentLanaguage}/auth/login`);
      return;
    }
    if (availableLanguages.indexOf(urlLang) === -1) {
      this.setAppLocalizations(currentLanaguage);
      this.changeAppDirection(currentLanaguage);
      this._router.navigateByUrl(currentLanaguage + this.location.path(), {
        replaceUrl: true
      });
      return;
    }
    this.changeAppDirection(currentLanaguage);
    this.setAppLocalizations(currentLanaguage);
    this._router.navigateByUrl(this.location.path(), {
      replaceUrl: true
    });
  }
}
