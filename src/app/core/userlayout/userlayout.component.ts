import { filter } from 'rxjs/operators';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';

import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import PerfectScrollbar from 'perfect-scrollbar';
import { TranslateService } from '@ngx-translate/core';
import { MatSidenav } from '@angular/material';
import { AuthService } from '../../modules/auth/services/auth.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
@Component({
  selector: 'app-userlayout',
  templateUrl: './userlayout.component.html',
  styleUrls: ['./userlayout.component.scss']
})
export class UserlayoutComponent implements OnInit {
  sidebarStatus = 'side';
  opened: boolean = true;

  constructor(
    public location: Location,
    private authService: AuthService,
    private translate: TranslateService,
    private breakpointObserver: BreakpointObserver,

  ) {
    this.getUrlPathName();
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  }
  @ViewChild(MatSidenav)
  sidenav: MatSidenav;

  toggle() {
    this.sidenav.toggle();
  }
  ngOnInit() {
    this.checkMediaQuery();
  }
  ngAfterViewInit() {
  }

  checkMediaQuery() {
    this.breakpointObserver
      .observe(['(max-width: 800px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.opened = false;
          this.sidebarStatus = 'over';
        } else {
          this.opened = true;
          this.sidebarStatus = 'side';
        }
      });
  }


  runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      const ps = new PerfectScrollbar(elemMainPanel);
      ps.update();
    }
  }

  changeSideNav(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches) {
      this.sidebarStatus = 'over';
      const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      const ps = new PerfectScrollbar(elemMainPanel);
      ps.update();
    }
  }
  isMac(): boolean {
    let bool = false;
    if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
      bool = true;
    }
    return bool;
  }

  getUrlPathName() {
    const urlPathName = window.location.pathname;
    console.log(urlPathName.replace('/ar/', ''));
  }

  Logout() {
    this.authService.logOut();
  }


}
