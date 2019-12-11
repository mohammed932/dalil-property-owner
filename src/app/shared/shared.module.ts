import { NgModule, LOCALE_ID } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http";
import { MaterialImportsModule } from './material-imports/material-imports.module';
import { AgmCoreModule } from '@agm/core';
import { ImgCacheModule } from 'ng-imgcache';

import { TranslatePipe } from './pipes/translate.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizedDatePipe } from './pipes/date.pipe';
import { SavebuttonComponent } from './components/savebutton/savebutton.component';
import { OpenDialogButtonComponent } from './components/open-dialog-button/open-dialog-button.component';
import { SpinnerComponent } from '../components/spinner/spinner.component';
import { CounterDirective } from './directive/counter.directive';
import { ResendCodeComponent } from './components/resend-code/resend-code.component';
import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { ComponentsModule } from '../components/components.module';
import { LocalizeRouterModule } from 'localize-router';
import { AddButtonComponent } from './components/add-button/add-button.component';
import { MomentModule } from 'ngx-moment';
import { ThreeSixtyModule } from '@mediaman/angular-three-sixty';
import { LoaderComponent } from './components/loader/loader.component';
import { MAT_CHECKBOX_CLICK_ACTION } from '@angular/material';
import { TermConditionComponent } from '../modules/auth/terms-and-condition/component/term-condition/term-condition.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
  
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialImportsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyAwsSpAS7gv7AA00Ce8ljPKII6lbme6EbU",
      libraries: []
    }),
    ComponentsModule,
    ImgCacheModule,
    ChartsModule,
    NgbModule,
    ToastrModule.forRoot(),
    TranslateModule,
    LocalizeRouterModule,
    MomentModule,
    ThreeSixtyModule,
    BsDatepickerModule.forRoot(),

  ],
  declarations: [
    TranslatePipe,
    LocalizedDatePipe,
    SavebuttonComponent,
    OpenDialogButtonComponent,
    SpinnerComponent,
    CounterDirective,
    ResendCodeComponent,
    AddButtonComponent,
    LoaderComponent,
    TermConditionComponent,
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MaterialImportsModule,
    AgmCoreModule,
    TranslateModule,
    LocalizedDatePipe,
    ImgCacheModule,
    SavebuttonComponent,
    OpenDialogButtonComponent,
    SpinnerComponent,
    CounterDirective,
    ResendCodeComponent,
    ChartsModule,
    NgbModule,
    ToastrModule,
    TranslatePipe,
    ComponentsModule,
    LocalizeRouterModule,
    AddButtonComponent,
    MomentModule,
    ThreeSixtyModule,
    LoaderComponent,
    TermConditionComponent,
    BsDatepickerModule
  ],
  providers: [
    TranslatePipe,
    DatePipe,
    {provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check'}
  ],

})
export class SharedModule {

}
