import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualificationDetailsDialogComponent } from './qualification-details-dialog.component';

describe('QualificationDetailsDialogComponent', () => {
  let component: QualificationDetailsDialogComponent;
  let fixture: ComponentFixture<QualificationDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QualificationDetailsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QualificationDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
