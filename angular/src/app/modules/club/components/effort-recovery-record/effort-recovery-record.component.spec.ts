import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EffortRecoveryRecordComponent } from './effort-recovery-record.component';

describe('EffortRecoveryRecordComponent', () => {
  let component: EffortRecoveryRecordComponent;
  let fixture: ComponentFixture<EffortRecoveryRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EffortRecoveryRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EffortRecoveryRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
