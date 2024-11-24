import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportRubricDialogComponent } from './export-rubric-dialog.component';

describe('ExportRubricDialogComponent', () => {
  let component: ExportRubricDialogComponent;
  let fixture: ComponentFixture<ExportRubricDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportRubricDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportRubricDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
