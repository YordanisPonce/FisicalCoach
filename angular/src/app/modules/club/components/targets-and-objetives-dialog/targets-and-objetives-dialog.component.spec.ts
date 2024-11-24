import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetsAndObjetivesDialogComponent } from './targets-and-objetives-dialog.component';

describe('TargetsAndObjetivesDialogComponent', () => {
  let component: TargetsAndObjetivesDialogComponent;
  let fixture: ComponentFixture<TargetsAndObjetivesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TargetsAndObjetivesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetsAndObjetivesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
