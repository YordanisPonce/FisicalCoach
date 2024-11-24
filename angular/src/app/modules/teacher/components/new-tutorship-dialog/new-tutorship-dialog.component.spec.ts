import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTutorshipDialogComponent } from './new-tutorship-dialog.component';

describe('NewTutorshipDialogComponent', () => {
  let component: NewTutorshipDialogComponent;
  let fixture: ComponentFixture<NewTutorshipDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTutorshipDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTutorshipDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
