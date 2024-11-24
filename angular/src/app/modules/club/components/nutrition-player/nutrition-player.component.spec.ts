import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionPlayerComponent } from './nutrition-player.component';

describe('NutritionPlayerComponent', () => {
  let component: NutritionPlayerComponent;
  let fixture: ComponentFixture<NutritionPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NutritionPlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NutritionPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
