import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoWithTitleComponent } from './logo-with-title.component';

describe('LogoWithTitleComponent', () => {
  let component: LogoWithTitleComponent;
  let fixture: ComponentFixture<LogoWithTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogoWithTitleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoWithTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
