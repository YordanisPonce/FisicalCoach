import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmScoutingDialogComponent } from './confirm-scouting-dialog.component';

describe('ConfirmScoutingDialogComponent', () => {
  let component: ConfirmScoutingDialogComponent;
  let fixture: ComponentFixture<ConfirmScoutingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmScoutingDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmScoutingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
