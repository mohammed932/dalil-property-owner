import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { routerTransition } from '../../shared/router.animations';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  animations: [
    routerTransition(),
  ]
})
export class AuthComponent implements OnInit {

  constructor(
    private translate: TranslateService,
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');


  }
  ngOnInit() {
  }





}
