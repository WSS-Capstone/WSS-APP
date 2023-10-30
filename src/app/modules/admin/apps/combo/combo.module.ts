import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatRippleModule} from '@angular/material/core';
import {MatSortModule} from '@angular/material/sort';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {SharedModule} from 'app/shared/shared.module';
import {ComboListComponent} from "./list/combo.component";
import {ComboComponent} from "./combo.component";
import {itemRoutes} from "./combo.routing";
import {ComboDetailsComponent} from "./detail/details.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from "@angular/material/snack-bar";
import {ComboDetailComponent} from "./combo-detail/details.component";

@NgModule({
    declarations: [
        ComboComponent,
        ComboListComponent,
        ComboDetailsComponent,
        ComboDetailComponent
    ],
    imports: [
        RouterModule.forChild(itemRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSortModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatDialogModule,
        MatSnackBarModule,
        SharedModule
    ],
    providers: [
        {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
    ]
})
export class ComboModule {
}
