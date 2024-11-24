import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchPlayerResultsComponent } from './match-player-results.component';

describe('MatchPlayerResultsComponent', () => {
  let component: MatchPlayerResultsComponent;
  let fixture: ComponentFixture<MatchPlayerResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchPlayerResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchPlayerResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
