import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionMatchModalComponent } from './competition-match-modal.component';

describe('CompetitionMatchModalComponent', () => {
  let component: CompetitionMatchModalComponent;
  let fixture: ComponentFixture<CompetitionMatchModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetitionMatchModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitionMatchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
