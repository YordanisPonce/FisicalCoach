import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRfdDialogComponent } from './new-rfd-dialog.component';

describe('NewRfdDialogComponent', () => {
  let component: NewRfdDialogComponent;
  let fixture: ComponentFixture<NewRfdDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewRfdDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRfdDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
