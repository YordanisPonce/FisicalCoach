import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyzePlayerDialogComponent } from './analyze-player-dialog.component';

describe('AnalyzePlayerDialogComponent', () => {
  let component: AnalyzePlayerDialogComponent;
  let fixture: ComponentFixture<AnalyzePlayerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyzePlayerDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyzePlayerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
