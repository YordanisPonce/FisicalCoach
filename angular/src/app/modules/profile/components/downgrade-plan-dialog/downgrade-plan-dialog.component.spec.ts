import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DowngradePlanDialogComponent } from './downgrade-plan-dialog.component';

describe('DowngradePlanDialogComponent', () => {
  let component: DowngradePlanDialogComponent;
  let fixture: ComponentFixture<DowngradePlanDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DowngradePlanDialogComponent]
    });
    fixture = TestBed.createComponent(DowngradePlanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
