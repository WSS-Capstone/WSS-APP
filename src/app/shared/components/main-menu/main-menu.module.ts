import {MainMenuComponent} from "./main-menu.component";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {RouterModule} from "@angular/router";

@NgModule({
    declarations: [MainMenuComponent],
    imports: [CommonModule, MatListModule, MatIconModule, MatButtonModule, RouterModule],
    exports: [MainMenuComponent],
})
export class MainMenuModule {}
