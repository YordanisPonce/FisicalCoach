import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRubricDialogComponent } from './new-rubric-dialog.component';

describe('NewRubricDialogComponent', () => {
  let component: NewRubricDialogComponent;
  let fixture: ComponentFixture<NewRubricDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewRubricDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRubricDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
