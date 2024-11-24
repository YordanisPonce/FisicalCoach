import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EffortQuestionsDialogComponent } from './effort-questions-dialog.component';

describe('EffortQuestionsDialogComponent', () => {
  let component: EffortQuestionsDialogComponent;
  let fixture: ComponentFixture<EffortQuestionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EffortQuestionsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EffortQuestionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
