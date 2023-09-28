import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoriesListViewComponent } from './view/categories-list-view/categories-list-view.component';
import { CategoriesRoutingModule } from './categoryies-routing.module';
import { CategoryListComponent } from './containers/category-list/category-list.component';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";

const containers = [];
const views = [CategoriesListViewComponent];
const pipes = [];
const directives = [];

@NgModule({
  declarations: [...containers, ...views, CategoryListComponent],
  imports: [
    ...pipes,
    ...directives,
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    CategoriesRoutingModule,
    MatButtonModule,
    MatInputModule,
  ],
  providers: [],
})
export class CategoriesModule {}
