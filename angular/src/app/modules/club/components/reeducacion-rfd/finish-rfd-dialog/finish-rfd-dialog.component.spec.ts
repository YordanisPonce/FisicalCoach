import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishRfdDialogComponent } from './finish-rfd-dialog.component';

describe('FinishRfdDialogComponent', () => {
  let component: FinishRfdDialogComponent;
  let fixture: ComponentFixture<FinishRfdDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishRfdDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishRfdDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
