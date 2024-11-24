import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubricsListDialogComponent } from './rubrics-list-dialog.component';

describe('RubricsListDialogComponent', () => {
  let component: RubricsListDialogComponent;
  let fixture: ComponentFixture<RubricsListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RubricsListDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RubricsListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
