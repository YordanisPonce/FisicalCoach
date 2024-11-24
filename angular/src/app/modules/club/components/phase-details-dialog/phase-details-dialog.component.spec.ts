import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseDetailsDialogComponent } from './phase-details-dialog.component';

describe('PhaseDetailsDialogComponent', () => {
  let component: PhaseDetailsDialogComponent;
  let fixture: ComponentFixture<PhaseDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhaseDetailsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhaseDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
