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
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatSortModule} from '@angular/material/sort';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {SharedModule} from 'app/shared/shared.module';
import {TaskListComponent} from "./list/task.component";
import {TaskComponent} from "./task.component";
import {itemRoutes} from "./task.routing";
import {TaskDetailsComponent} from "./detail/details.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from "@angular/material/snack-bar";
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatTabsModule} from "@angular/material/tabs";

@NgModule({
    declarations: [
        TaskComponent,
        TaskDetailsComponent,
        TaskListComponent
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
        SharedModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTabsModule,
    ],
    providers: [
        {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
    ]
})
export class TaskModule {
}
