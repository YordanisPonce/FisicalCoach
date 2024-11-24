import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculateRpeDialogComponent } from './calculate-rpe-dialog.component';

describe('CalculateRpeDialogComponent', () => {
  let component: CalculateRpeDialogComponent;
  let fixture: ComponentFixture<CalculateRpeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculateRpeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculateRpeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
