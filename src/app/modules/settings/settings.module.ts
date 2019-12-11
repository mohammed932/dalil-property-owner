import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../../shared/shared.module";
import { SettingsRoutingModule } from './settings.routing';
import { SettingsComponent } from './settings.component';

@NgModule({
    imports: [CommonModule, SharedModule, SettingsRoutingModule],
    declarations: [SettingsComponent]
})
export class SettingsModule { }
