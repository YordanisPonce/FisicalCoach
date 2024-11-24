import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProgramDialogComponent } from './new-program-dialog.component';

describe('NewProgramDialogComponent', () => {
  let component: NewProgramDialogComponent;
  let fixture: ComponentFixture<NewProgramDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewProgramDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProgramDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
