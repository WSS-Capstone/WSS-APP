import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesListViewComponent } from './categories-list-view.component';

describe('CategoriesListViewComponent', () => {
  let component: CategoriesListViewComponent;
  let fixture: ComponentFixture<CategoriesListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriesListViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
