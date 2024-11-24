import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionElementsDialogComponent } from './nutrition-elements-dialog.component';

describe('NutritionElementsDialogComponent', () => {
  let component: NutritionElementsDialogComponent;
  let fixture: ComponentFixture<NutritionElementsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NutritionElementsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NutritionElementsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
