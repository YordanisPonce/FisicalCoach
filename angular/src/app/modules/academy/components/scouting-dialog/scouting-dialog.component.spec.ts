import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoutingDialogComponent } from './scouting-dialog.component';

describe('ScoutingDialogComponent', () => {
  let component: ScoutingDialogComponent;
  let fixture: ComponentFixture<ScoutingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoutingDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoutingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
