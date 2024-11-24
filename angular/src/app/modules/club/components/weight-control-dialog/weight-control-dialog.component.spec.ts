import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightControlDialogComponent } from './weight-control-dialog.component';

describe('WeightControlDialogComponent', () => {
  let component: WeightControlDialogComponent;
  let fixture: ComponentFixture<WeightControlDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeightControlDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightControlDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
