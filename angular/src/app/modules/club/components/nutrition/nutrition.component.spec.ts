import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionComponent } from './nutrition.component';

describe('NutritionComponent', () => {
  let component: NutritionComponent;
  let fixture: ComponentFixture<NutritionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NutritionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
<<<<<<< HEAD
    fixture = TestBed.createComponent(NutritionComponent);
=======
    fixture = TestBed.createComponent(NutricionComponent);
>>>>>>> ffd024a4e2110f8576c7e418288889622da3d82a
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
