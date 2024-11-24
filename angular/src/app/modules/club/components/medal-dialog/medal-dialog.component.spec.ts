import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedalDialogComponent } from './medal-dialog.component';

describe('MedalDialogComponent', () => {
  let component: MedalDialogComponent;
  let fixture: ComponentFixture<MedalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedalDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
