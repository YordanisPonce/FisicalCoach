import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EffortRecoveryDetailsComponent } from './effort-recovery-details.component';

describe('EffortRecoveryDetailsComponent', () => {
  let component: EffortRecoveryDetailsComponent;
  let fixture: ComponentFixture<EffortRecoveryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EffortRecoveryDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EffortRecoveryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
