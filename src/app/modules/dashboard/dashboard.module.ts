import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardRoutingModule } from "./dashboard.routing";
import { DashboardComponent } from "./dashboard.component";
import { SharedModule } from "../../shared/shared.module";
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyHttpInterceptor } from '../../core/interceptor/my-http-interceptor';
import {NgxChartsModule} from '@swimlane/ngx-charts';

@NgModule({
  imports: [CommonModule, SharedModule, DashboardRoutingModule, NgxChartsModule],
  declarations: [DashboardComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyHttpInterceptor,
      multi: true
    }
  ]
})
export class DashBoardModule {}
