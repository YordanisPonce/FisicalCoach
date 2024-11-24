import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCalificationDialogComponent } from './new-calification-dialog.component';

describe('NewCalificationDialogComponent', () => {
  let component: NewCalificationDialogComponent;
  let fixture: ComponentFixture<NewCalificationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCalificationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCalificationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
